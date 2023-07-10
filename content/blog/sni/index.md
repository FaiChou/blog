---
title: "SNI"
date: "2023-03-15"
category: "dev"
emoji: "🫥"
---

在 TCP 握手时, 本机和服务器 IP 之间建立联系, 如果是 HTTPS, 则需要增加验证证书的步骤.

很多情况下会有多个域名绑定了同一个服务器 IP, 如果是普通的 HTTP, 在 nginx 可以这样配置:

```
server {
  listen 80;
  server_name example.com www.example.com;
  root /var/www/example.com;
  # OTHER CONFIG
}
```

或者:

```
http {
    # server 1
    server {
        listen       80;
        server_name  domain1.com;
        location / {
            proxy_pass http://localhost:8000;
        }
    }
    # server 2
    server {
        listen       80;
        server_name  domain2.com;
        location / {
            proxy_pass http://localhost:8001;
        }
    }
    # server 3
    server {
        listen       80;
        server_name  domain3.com;
        location / {
            proxy_pass http://localhost:8002;
        }
    }
    # default server
    server {
        listen       80 default_server;
        server_name  _;
        return       404;
    }
}
```

但是如果是 HTTPS, 需要在握手时候验证证书, 所以在握手时候需要将域名告诉对方, 找到匹配的证书, 这就是 SNI 的工作. 否则会导致证书找不到而请求失败.

默认情况下, nginx 并不会开启 `proxy_ssl_server_name`, 也就是说不启用 SNI. 如果使用 nginx 反代一个虚拟主机的服务, 比如 Cloudflare Workers, 此时如果不开启 SNI, 会导致与 CF 握手时候, CF 并不清楚请求哪一个域名下的服务, 所以找不到匹配的证书, 因此会报 502 错误. 当然也可以使用 `proxy_ssl_name` 字段复写于最终服务器收到的域名.


既然讲到这, 就顺便提一下 `proxy_ssl_verify` 与 `proxy_ssl_trusted_certificate` 字段, 默认情况下, nginx 是不会验证反代的 https 证书的, 也就是 `proxy_ssl_verify` 是 *off*, 如果打开此字段, 就会验证此证书的合法性.
如果指定了 `proxy_ssl_trusted_certificate` 字段, 就会与反代服务器返回的证书与这里填写的证书做对比, 来确定该 SSL 证书是否匹配. 如果 SSL 证书与根证书相符，则连接将被允许并将请求转发给被代理服务器；否则，连接将被拒绝(返回 502 错误).

## 例子1

后端服务器配置：

```
server {
    listen 443 ssl;
    server_name abc.example.com;

    ssl_certificate /etc/nginx/ssl/abc.example.com.cert;
    ssl_certificate_key /etc/nginx/ssl/abc.example.com.key;

    location / {
        proxy_pass http://localhost:8080;
    }
}
server {
    listen 443 ssl;
    server_name def.example.com;

    ssl_certificate /etc/nginx/ssl/def.example.com.cert;
    ssl_certificate_key /etc/nginx/ssl/def.example.com.key;

    location / {
        proxy_pass http://localhost:8081;
    }
}
```

代理服务器配置：

```
server {
    listen 443 ssl;
    server_name foo.com;
    location / {
        proxy_pass https://abc.example.com;
    }
}
```

这种情况下访问 `http://foo.com` 最终是可以正确找到证书的。因为为每个 server block 配置了特定的 `server_name` 和对应的 SSL 证书。因此 Nginx 可以通过 server_name（在这个例子中是 `abc.example.com` 和 `def.example.com`）选择正确的证书，即使 `proxy_ssl_server_name` 设置为 off。

## 例子2

在 vercel 中写一个服务，然后绑定一个自己在 cf 管理的域名，由于 vercel 强制 https, 访问这个域名时候，cf 到 vercel 必须是 https，所以在 cf 的 SSL/TSL 中必须设置为 Full。由于 vercel 服务器上面跑着无数个服务，访问域名是怎么获取到正确的服务呢？通过 CNAME Name+Content, 比如 Name: `abc`, Content：`cname.vercel-dns.com`，这样用户访问 abc.yourdomain.com 时候，会解析到 `cname.vercel-dns.com`. 最终建立连接时候，vercel 根据 host 可以知道哪个服务。

## 例子3

```
server {
  listen 443 ssl;
  server_name {your_domain_name};
  ssl_certificate {your_cert_path};
  ssl_certificate_key {your_cert_key_path};
  ssl_session_cache shared:le_nginx_SSL:1m;
  ssl_session_timeout 1440m;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
  ssl_prefer_server_ciphers on;
  ssl_ciphers TLS13-AES-256-GCM-SHA384:TLS13-CHACHA20-POLY1305-SHA256:TLS13-AES-128-GCM-SHA256:TLS13-AES-128-CCM-8-SHA256:TLS13-AES-128-CCM-SHA256:EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+ECDSA+AES128:EECDH+aRSA+AES128:RSA+AES128:EECDH+ECDSA+AES256:EECDH+aRSA+AES256:RSA+AES256:EECDH+ECDSA+3DES:EECDH+aRSA+3DES:RSA+3DES:!MD5;
  location / {
    proxy_pass  https://api.openai.com/;
    proxy_ssl_server_name on;
    proxy_set_header Host api.openai.com;
    proxy_set_header Connection '';
    proxy_http_version 1.1;
    chunked_transfer_encoding off;
    proxy_buffering off;
    proxy_cache off;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

这是使用 nginx 代理 `api.openai.com`。


## 参考

- [什么是SNI？TLS服务器名称指示如何工作](https://www.cloudflare-cn.com/learning/ssl/what-is-sni/)
- [Nginx反向代理，当后端为Https时的一些细节和原理](https://blog.dianduidian.com/post/nginx%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86%E5%BD%93%E5%90%8E%E7%AB%AF%E4%B8%BAhttps%E6%97%B6%E7%9A%84%E4%B8%80%E4%BA%9B%E7%BB%86%E8%8A%82%E5%92%8C%E5%8E%9F%E7%90%86/)
