This is a _Next.js_ project bootstrapped with `create-next-app`, with _Astryx_, _React Icons_, _StyleX_, _Tailwind_ and much more integrated. Ready to start development.

## Get Started

First, run the development server. Then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

```bash
npm i && npm run dev
```

## Learn More

To learn more about the tech stack, take a look at the following resources:

- [Next.js](https://nextjs.org/docs) - a React Framework
- [Astryx](https://astryx.atmeta.com/) - a component library
- [React Icons](https://react-icons.github.io/react-icons/) - all icons in one
- [StyleX](https://stylexjs.com/) - a CSS-in-JS library
- [Tailwind](https://tailwindcss.com/) - a CSS class utilities

## Deployment

### 1. Deploy nginx

1. 轻量云服务资源不足 npm run build 卡死

```bash
# 查看当前交换空间
free -h
swapon --show

# 创建交换文件（推荐 4GB）
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 永久生效
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 调整交换性（0-100，值越高越频繁使用交换）
sudo sysctl vm.swappiness=60
echo 'vm.swappiness=60' | sudo tee -a /etc/sysctl.conf
```

2. 轻量云服务 npm run start -- -H 0.0.0.0 -p 80 权限不足

```bash
sudo env PATH=$PATH npm run start -- -H 0.0.0.0 -p 80
```

3. 配置 nginx

```bash
# 安装 nginx
sudo apt update
sudo apt install nginx
```

```bash
# 配置站点
cat <<EOF | sudo tee /etc/nginx/sites-available/example.com
server {

    server_name example.com;

    location /_next/static/ {
        alias /home/admin/stocks/.next/static/;
        add_header Cache-Control "public, immutable";
        expires 1y;
    }

    location /public/ {
        alias /home/admin/stocks/public/public/;
        add_header Cache-Control "public, immutable";
        expires 1y;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

server {

    server_name www.example.com;

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    return 301 https://example.com$request_uri;

}
server {

    listen 80;

    server_name example.com www.example.com;

    if ($host = www.example.com) {
        return 301 https://example.com$request_uri;
    } # managed by Certbot


    if ($host = example.com) {
        return 301 https://example.com$request_uri;
    } # managed by Certbot

    return 404; # managed by Certbot

}
EOF
```

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload
sudo rm /etc/nginx/sites-enabled/default
```

```bash
# 禁用站点
sudo rm /etc/nginx/sites-enabled/example.com
sudo nginx -s reload
```

4. 配置 HTTPS

```bash
# 安装依赖
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

```bash
# 自动配置
sudo certbot --nginx -d example.com -d www.example.com
```

```bash
# 验证配置
sudo certbot certificates
```

```bash
# 自动续期
sudo systemctl status certbot.timer
# 手动测试续期（模拟运行）
sudo certbot renew --dry-run
```

### 2. Deploy node.js

1. 启动与更新

```bash
npm run build && npm run deploy  # 启动
npm run build && npm run restart # 更新
```

2. 开机自启动

```bash
# 将当前运行的 pm2 进程列表保存到 ~/.pm2/dump.pm2 中，供后续恢复使用
npx pm2 save
# 生成开机自启脚本，PATH=$PATH:... 要改为 "PATH=$PATH:..."
npx pm2 startup

# 取消开机自启
npx pm2 unstartup
```
