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


## 参考

- [什么是SNI？TLS服务器名称指示如何工作](https://www.cloudflare-cn.com/learning/ssl/what-is-sni/)
- [Nginx反向代理，当后端为Https时的一些细节和原理](https://blog.dianduidian.com/post/nginx%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86%E5%BD%93%E5%90%8E%E7%AB%AF%E4%B8%BAhttps%E6%97%B6%E7%9A%84%E4%B8%80%E4%BA%9B%E7%BB%86%E8%8A%82%E5%92%8C%E5%8E%9F%E7%90%86/)
