---
layout: post
title: "Nginx安全加固"
date: 2026-08-31
categories: ["蓝队", "安全加固", "中间件加固"]
---

> **阵营**：蓝队　**分类**：蓝队 / 安全加固 / 中间件加固

## 1. 适用情况

适用于使用 Nginx 进行部署的 Web 网站。
## 2. 技能要求

熟悉 Nginx 配置，能够使用 Nginx 进行部署，并能针对站点使用 Nginx 进行安全加固。
## 3. 前置条件

1. 根据站点开放端口，进程 ID，确认站点采用 Nginx 进行部署；
2. 找到 Nginx 安装目录，针对具体站点对配置文件进行修改；
3. 在执行过程中若有任何疑问或建议，应及时反馈。
## 4. 详细操作
### 4.1 日志配置

1. 备份 nginx.conf 配置文件。
2. 修改配置，按如下设置日志记录文件、记录内容、记录格式，添加标签为 main 的 log_format 格式（http 标签内，在所有的 server 标签内可以调用）：
```nginx
log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
'$status $body_bytes_sent "$http_referer" '
'"$http_user_agent" "$http_x_forwarded_for"';
```
3. 在 server 标签内，定义日志路径：
```nginx
access_log logs/host.access.log main;
```
4. 保存，然后重启 nginx 服务。
### 4.2 禁止目录浏览

1. 备份 nginx.conf 配置文件。
2. 编辑配置文件，HTTP 模块添加如下一行内容：
```nginx
autoindex off;
```
3. 保存，然后重启 nginx 服务。
### 4.3 限制目录执行权限

1. 备份 nginx.conf 配置文件。
2. 编辑配置文件，在 server 标签内添加如下内容：
```nginx
# 示例：去掉单个目录的 PHP 执行权限
location ~ /attachments/.*\.(php|php5)?$ {
    deny all;
}

# 示例：去掉多个目录的 PHP 执行权限
location ~ /(attachments|upload)/.*\.(php|php5)?$ {
    deny all;
}
```
3. 保存，然后重启 nginx 服务。
**注意：**
- 以上的配置文件代码需要放到 location ~ .php{...} 上面，如果放到下面是无效的；
- attachments 需要写相对路径，不能写绝对路径。
### 4.4 错误页面重定向

1. 备份 nginx.conf 配置文件。
2. 修改配置，在 http{} 段加入如下内容：
```nginx
http {
    ...
    fastcgi_intercept_errors on;
    error_page 401 /401.html;
    error_page 402 /402.html;
    error_page 403 /403.html;
    error_page 404 /404.html;
    error_page 405 /405.html;
    error_page 500 /500.html;
    ...
}
```
3. 修改内容：
```nginx
ErrorDocument 400 /custom400.html
ErrorDocument 401 /custom401.html
ErrorDocument 403 /custom403.html
ErrorDocument 404 /custom404.html
ErrorDocument 405 /custom405.html
ErrorDocument 500 /custom500.html
```
其中 401.html、402.html、403.html、404.html、405.html、500.html 为要指定的错误提示页面。
4. 保存，重启 nginx 服务生效。
### 4.5 最佳经验实践
#### 4.5.1 隐藏版本信息

1. 备份 nginx.conf 配置文件。
2. 编辑配置文件，添加 http 模块中如下一行内容：
```nginx
server_tokens off;
```
3. 保存，然后重启 nginx 服务。
#### 4.5.2 限制 HTTP 请求方法

1. 备份 nginx.conf 配置文件。
2. 编辑配置文件，添加如下内容：
```nginx
if ($request_method !~ ^(GET|HEAD|POST)$ ) {
    return 444;
}
```
3. 保存，然后重启 nginx 服务。

**备注：** 只允许常用的 GET 和 POST 方法，顶多再加一个 HEAD 方法。
#### 4.5.3 限制 IP 访问

1. 备份 nginx.conf 配置文件。
2. 编辑配置文件，在 server 标签内添加如下内容：
```nginx
location / {
    deny 192.168.1.1; # 拒绝 IP
    allow 192.168.1.0/24; # 允许 IP
    allow 10.1.1.0/16; # 允许 IP
    deny all; # 拒绝其他所有 IP
}
```
3. 保存，然后重启 nginx 服务。
#### 4.5.4 限制并发和速度

1. 备份 nginx.conf 配置文件。
2. 编辑配置文件，在 server 标签内添加如下内容：
```nginx
# 旧版本 nginx 用第 2 行，新版本 nginx 用第 3 行配置（需取消注释）
# limit_zone one $binary_remote_addr 10m;
# limit_conn_zone $binary_remote_addr zone=one:10m;

server {
    listen   80;
    server_name down.test.com;
    index index.html index.htm index.php;
    root  /usr/local/www;
    # Zone limit;
    location / {
        limit_conn one 1;
        limit_rate 20k;
    }
    ...
}
```
3. 保存，然后重启 nginx 服务。
#### 4.5.5 控制超时时间

1. 备份 nginx.conf 配置文件。
2. 编辑配置文件，具体设置如下：
```nginx
client_body_timeout 10;  # 设置客户端请求主体读取超时时间
client_header_timeout 10;  # 设置客户端请求头读取超时时间
keepalive_timeout 5 5;  # 第一个参数指定客户端连接保持活动的超时时间，第二个参数是可选的，它指定了消息头保持活动的有效时间
send_timeout 10;  # 指定响应客户端的超时时间
```
3. 保存，然后重启 nginx 服务。
### 4.6 风险操作项
#### 4.6.1 Nginx 降权

1. 备份 nginx.conf 配置文件。
2. 编辑配置文件，添加如下一行内容： 
```nginx
user www;
```
3. 保存，然后重启 nginx 服务。
#### 4.6.2 防盗链

1. 备份 nginx.conf 配置文件。
2. 编辑配置文件，在 server 标签内添加如下内容：
```nginx
location ~* ^.+\.(gif|jpg|png|swf|flv|rar|zip)$ {
    valid_referers none blocked server_names *.nsfocus.com http://localhost baidu.com;
    if ($invalid_referer) {
        rewrite ^/ http://www.XXX.com/images/default/logo.gif redirect;
        # return 403;
    }
}
```
3. 保存，然后重启 nginx 服务。
#### 4.6.3 补丁更新

1. **软件信息**
    - 查看软件版本：`nginx -v`
        - 测试配置文件：`nginx -t`
2. **补丁安装**
    - 手动安装补丁或安装最新版本软件。
## 5. 集成 Naxsi 模块
### 5.1 下载 Naxsi

```bash
wget http://naxsi.googlecode.com/files/naxsi-core-0.51-1.tgz
```
### 5.2 解压 Naxsi

```bash
tar -zxvf naxsi-core-0.51-1.tgz
```
### 5.3 复制配置文件

切换到 naxsi-core-0.51-1 目录，并复制其配置文件到 nginx.conf 同目录下：
```bash
cp naxsi_core.rules /etc/nginx/naxsi_core.rules
```
修改 naxsi_core.rules 的配置如下：
### 5.4 编译安装 Nginx

查看系统原来编译 Nginx 的参数，在原来的编译参数的首行加入：
```bash
--add-module=/root/install/naxsi-core-0.51-1/naxsi_src
```
### 5.5 验证 nginx 是否安装成功

切换目录到与 nginx.conf 同目录下，新建 nbs.rules 文件。
### 5.6 配置 nginx.conf
### 5.7 重启 nginx
### 5.8 测试拦截规则是否启用

上述的规则仅过滤“<”、“>”。测试 XSS 注入。
