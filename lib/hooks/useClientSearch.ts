import { MetaState } from '@/lib/statex';
import { useEffect } from 'react';

const channel = new MetaState<Record<string, string>>();

export const useClientSearch = <T extends string | undefined>(key: string, getValue: (param?: string) => T) => {
  const param = channel.use(key);
  const value = getValue(param);

  useEffect(() => {
    if (key in channel.get() || value === undefined) return;
    const query = new URLSearchParams(window.location.search);
    const param = query.get(key);
    if (typeof param === 'string') {
      channel.dispatch(key, param);
    } else {
      const param = localStorage.getItem(`ucs.${key}`);
      channel.dispatch(key, typeof param === 'string' ? param : (undefined as any));
    }
  }, [key]);

  useEffect(() => {
    const id = requestIdleCallback(() => {
      const query = new URLSearchParams(window.location.search);
      if (typeof value === 'string') {
        if (getValue() !== value) {
          localStorage.setItem(`ucs.${key}`, value);
          query.set(key, value);
        } else {
          localStorage.removeItem(`ucs.${key}`);
          query.delete(key);
        }
      } else {
        delete channel.get()[key];
        query.delete(key);
      }
      window.history.replaceState(null, '', `?${query}`);
    });
    return () => cancelIdleCallback(id);
  }, [key, value]);

  return [value, channel.useDispatch(key)] as const;
};
