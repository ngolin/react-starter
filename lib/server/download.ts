import 'server-only';

import { promises as fs, existsSync } from 'node:fs';
import https from 'node:https';
import http from 'node:http';
import path from 'node:path';

export const getPublicIconPath = (url: string, fileName: string) => {
  try {
    const publicPath = path.join('/public/icon', fileName);
    return getPublicPath(url, publicPath);
  } catch {
    return url;
  }
};

export const getPublicLogoPath = (url: string, market: string, code: string) => {
  try {
    const { pathname } = new URL(url);
    const ext = path.extname(pathname);
    if (!ext) {
      return url;
    }
    const publicPath = path.join(
      '/public/logo',
      encodeURIComponent(market).replace(/%/g, ''),
      encodeURIComponent(code).replace(/%/g, '') + ext.toLowerCase(),
    );
    return getPublicPath(url, publicPath);
  } catch {
    return url;
  }
};

const getPublicPath = (url: string, publicPath: string) => {
  const filePath = path.join(process.env.CODEBASE_DIR!, 'public', publicPath);
  if (existsSync(filePath)) {
    return publicPath;
  }
  downloadUrl(filePath, url);
  return url;
};

export async function downloadUrl(filePath: string, url: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  return new Promise<void>((resolve, reject) => {
    (url.startsWith('https://') ? https : http)
      .get(url, async response => {
        const file = await fs.open(filePath, 'w');
        const fileStream = file.createWriteStream();
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      })
      .on('error', error => {
        fs.unlink(filePath).catch(reject);
        reject(error);
      });
  });
}

export function withCodebaseFallback<F extends (...args: any[]) => Promise<any>>(
  get: F,
  filePath: string,
  timeout = 60 * 1000,
  maxAge = 24 * 60 * 60 * 1000,
): F {
  const fullPath = path.join(process.env.CODEBASE_DIR!, filePath);
  let timestamp: Promise<number>;
  const withTimeout = async <T>(data: Promise<T>) => {
    const timer = new Promise<T>((resolve, reject) =>
      setTimeout(() => {
        if (existsSync(fullPath)) {
          reject(new Error(`timeout: ${timeout}`));
        } else {
          resolve(data);
        }
      }, timeout),
    );
    return await Promise.race([data, timer]);
  };
  return (async (...args: Parameters<F>) => {
    try {
      const last = timestamp ? await withTimeout(timestamp) : 0;
      if (Date.now() - last < maxAge) {
        if (existsSync(fullPath)) {
          console.log('cache read', filePath);
          return JSON.parse(await fs.readFile(fullPath, 'utf8'));
        }
      }
      const data = get(...args);
      timestamp = data
        .then(async data => {
          await fs.writeFile(fullPath, JSON.stringify(data, undefined, 2), 'utf8');
          console.log('write', filePath);
          return Date.now();
        })
        .catch(() => last);
      return await withTimeout(data);
    } catch (error) {
      console.error(error);
      console.log('error read', filePath);
      return JSON.parse(await fs.readFile(fullPath, 'utf8'));
    }
  }) as any;
}
