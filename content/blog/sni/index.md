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
    server_name website.com;
    location / {
        proxy_pass https://abc.example.com;
    }
}
```

~~这种情况下访问 `https://website.com` 最终是可以正确找到证书的。因为为每个 server block 配置了特定的 `server_name` 和对应的 SSL 证书。因此 Nginx 可以通过 server_name（在这个例子中是 `abc.example.com` 和 `def.example.com`）选择正确的证书，即使 `proxy_ssl_server_name` 设置为 off.~~

这种情况访问 `https://website.com`，代理服务器请求 `https://abc.example.com`，此时由于没有开 `proxy_ssl_server_name`，在握手阶段，没有发送 SNI 信息到 abc 服务器，所以没有正确的证书返回，而是返回了 abc 服务器默认的证书。但是默认 nginx 也是不验证证书的，所以还是会正常连接。

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



## nginx 的 server block 来控制不同域名使用不同的证书，与SNI来指示选择不同证书。有什么区别？

首先，我们来理解下 SNI（Server Name Indication）和 Nginx的 server block 是什么。

SNI 是一个 TLS 的扩展，它允许client在握手阶段就发送目标主机名，这样同一IP的后端服务器可以提供不同域名所对应的证书。SNI在SSL/TLS握手过程中的早期阶段就解决了服务器需要知道客户端目标主机名的问题，这样无需为每个网站分配一个独立的IP地址。

Nginx的 server block 则是Nginx服务器的配置，这些配置定义了如何处理来自特定域名的请求。在server block中可以为每个server定义不同的SSL证书。

这两者之间的区别主要在于他们的工作级别和使用场景：

1. SNI是底层协议的一部分，工作在协议栈中的更底层，它是在发起连接建立的SSL/TLS握手过程中来识别不同的证书的；

2. 而Nginx的server block则工作在应用级别上，是在已经建立了连接后，~~Nginx在处理请求时读取到特定域名后，使用相应的证书逻辑。这个处理是在应用程序级别进行的，更接近于服务端业务处理逻辑的部分。~~

因此，简单总结就是，SNI是在建立安全连接阶段进行操作的，用于在同一个IP地址和端口下，使服务器能够根据客户端传过来的主机的名字，返回不同的证书。而Nginx的server block则是在安全连接已经建立后，处理HTTP请求时进行操作的，根据请求的 host header 选择使用对应的 server block，然后使用这个 block 配置的 SSL 证书。

## 在客户端与服务器建立连接的过程中，首先DNS获取到服务器的ip地址，然后进行tcp3次握手，之后进行SSL/TSL握手。在握手完成前，服务器是否知道请求的 host name? 

在TCP三次握手完成之后，客户端和服务器端会进行SSL/TLS握手。正是在这个SSL/TLS握手过程中，客户端会通过Server Name Indication（SNI）扩展将主机名称（即访问的域名）发送给服务器。

SNI作为TLS协议的一部分，是在握手过程的ClientHello消息中发送的。这是SSL/TLS握手的最开始步骤，在握手完成之前。这也就意味着，在握手完成前，服务器是可以通过SNI获取到请求的主机名称的，前提是客户端支持并发送了SNI。这样服务器就能根据请求的主机名称选择相应的证书进行SSL/TLS握手。

然而，请注意，在HTTP/1.1及更高版本的HTTP协议中，请求报文的header中会包含一个”Host”字段，这个字段的值也是客户端想要访问的主机名称。但这一步是在TCP连接和SSL/TLS连接都已经建立之后，HTTP请求报文被发送出去的时候才会进行的。因此，在握手完成前，服务器并不能从HTTP请求中获取到主机名称。

总的来说，如果客户端支持并发送了SNI，服务器就能在SSL/TLS握手过程中得知请求的主机名称。如果没有SNI，服务器需要等到收到HTTP请求报文之后，才能从"Host"字段中获取到主机名称。

## 问题

访问一个 https，首先dns查询到ip，然后进行tcp3次握手，后来ssl/tsl握手，这次握手时候可以发送 sni 信息，让服务器知道是哪一个域名，然后找到对应的证书。
在 nginx server block 中也可以配置证书。
但是 nignx 是作用在应用层的，也就是在握手完成后，nginx 才能从 header 中获取到 host。这时候握手已经结束了，配置在 nginx 里面的证书有啥用？


## 回答

这是一个非常好的问题。当一个HTTPS请求被发出后，首先会通过DNS来解析域名到对应的IP地址，接下来通过TCP协议进行三次握手来建立一个TCP连接。然后在这个连接上进行SSL/TLS握手，来协商并建立一个加密的会话。

在SSL/TLS握手过程中，客户端会通过扩展字段Server Name Indication (SNI)告知服务器它打算访问的域名。这个SNI信息在握手的Client Hello消息阶段就发送出去了，这是在接收到任何服务器证书之前。所以，基于这个SNI信息，服务器可以从它的证书库中找到并返回正确的证书。

关于你的疑问，Nginx是一个web服务器/反向代理服务器，它在应用层工作，处理HTTP/HTTPS请求等。当你在Nginx的server block中配置SSL证书时，它会用于在SSL/TLS握手过程中返回给客户端。

对于一个使用SNI的客户端来说，Nginx会根据SNI的值选择对应的server block，进而选择对应的证书。即使Nginx在应用层工作，它也能在SSL/TLS握手过程中做这件事，因为SSL/TLS握手是在建立应用层HTTP/HTTPS会话之前发生的。所以，虽然在握手结束后，Nginx才能从HTTP header中获取到host，但是它能在握手过程中，根据SNI字段选择正确的证书。

## 问题

除了 nginx 还有什么方法可以在服务器上设置多个域名多个证书？


## 回答

在一个服务器上设置多个域名和对应的多个证书有几种常用的方法：

Apache HTTP Server: Apache 是一个常用的 web 服务器，类似于 Nginx。Apache 通过名为 <VirtualHost> 的配置块支持基于域名的虚拟主机，就像 Nginx 的 server blocks 一样。你可以在每个 <VirtualHost> 中单独配置 SSL 证书。

HAProxy: HAProxy 是一个高效的负载均衡器和反向代理服务器，它也支持使用 SNI 为多个域名提供不同的 SSL 证书。在 HAProxy 的配置中，你可以使用 bind 指令和 crt 参数为每个域名指定一个证书文件。

Caddy Server: Caddy 是一个自动 HTTPS 的 web 服务器，它自动处理证书的申请和续期。你可以在 Caddyfile 配置文件中指定多个站点，并为每个站点指定不同的证书。

IIS (Internet Information Services)：IIS 是 Microsoft 提供的一个 web 服务器和应用服务器。在 IIS 中，你可以创建多个站点，并为每个站点配置单独的 SSL 证书。

这些都是基于 SNI 支持多证书配置的例子。在选择哪种方法的时候，应该考虑你的具体需求，包括你的操作系统，你的应用程序类型，你的性能需求，等等。

## 问题

在 nginx server block 中定义了域名和证书，当 nignx 程序运行的时候，会解析这个配置，然后使用系统提供的接口（SNI）来完成相应的配置，这属于 http 的规范，所以服务器遵循了这个规范，使用一些例如 c 语言提供了 SNI 的接口，nginx 程序可以调用这个接口来实现它。我说的对吗？

## 回答

基本上你的理解是正确的，我简单地澄清一下细节。

在Nginx启动时，它确实会解析其配置文件，包括server block中定义的域名和证书。Nginx使用的是OpenSSL库，这是一个开源的SSL/TLS库，可以用来实现SSL/TLS握手和其他操作。

OpenSSL支持SNI (Server Name Indication)，这是一个TLS扩展，允许客户端在握手阶段指明它想要连接的服务器的主机名。这对于在同一IP地址和端口上托管多个SSL/TLS证书（即多个HTTPS域名）非常有用。

所以，当一个新的HTTPS请求到来时，Nginx会使用OpenSSL（其内部包含SNI支持）进行SSL/TLS握手。根据客户端在SNI中指明的主机名，Nginx会从其配置中选择相应的server block，使用其中定义的证书。

需要注意的是，SNI并非HTTP规范的一部分，而是TLS协议的一部分。它是在进行SSL/TLS握手，即在建立HTTP/HTTPS会话之前使用的。

最后，关于"C语言提供的SNI接口"这个说法需要澄清。实际上，C语言本身并没有提供SNI接口。相反，这些接口是由像OpenSSL这样的库提供的，这些库是用C语言编写的。Nginx作为使用C语言编写的程序，会使用这些库来实现SNI和其他SSL/TLS功能。

## 问题

在 OpenSSL 中的什么地方有相关的协议接口？

## 回答

OpenSSL 是一个功能非常强大的库，用于处理 SSL 和 TLS 协议的各种任务。OpenSSL 提供了一套强大的 API ，用于各种操作，包括管理证书，执行握手，加密和解密通信，以及其他许多功能。关于 SNI 的处理，OpenSSL 也提供了相关的接口。

你可以在 SSL_CTX_set_tlsext_servername_callback 函数和 SSL_set_tlsext_host_name 函数中找到 SNI 的使用。这两个函数在 OpenSSL 中是用来处理 SNI 的。

SSL_CTX_set_tlsext_servername_callback函数用于设置服务器端的回调函数，当接收到客户端的SNI扩展字段时，这个回调函数会被调用。在这个回调函数中，你可以根据SNI字段来选择对应的证书。

SSL_set_tlsext_host_name函数用于设置客户端的SNI字段。这个函数在客户端程序中使用，用来指定想要连接的服务器的主机名。


## 参考

- [什么是SNI？TLS服务器名称指示如何工作](https://www.cloudflare-cn.com/learning/ssl/what-is-sni/)
- [Nginx反向代理，当后端为Https时的一些细节和原理](https://blog.dianduidian.com/post/nginx%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86%E5%BD%93%E5%90%8E%E7%AB%AF%E4%B8%BAhttps%E6%97%B6%E7%9A%84%E4%B8%80%E4%BA%9B%E7%BB%86%E8%8A%82%E5%92%8C%E5%8E%9F%E7%90%86/)
