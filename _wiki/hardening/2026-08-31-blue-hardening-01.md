---
layout: page
title: "Apache安全加固"
group: "安全加固"
---

## 一、账号与权限管理
### 1. 以非 root 用户运行 Apache

- **配置文件路径**：`/etc/httpd/conf/httpd.conf`
- **操作步骤**：
```plain
User apache
Group apache
```
- **检测方法**：
```bash
ps -ef | grep httpd  # 确认进程以 apache 用户运行
```
### 2. 设置文件和目录权限

- **操作步骤**：
```bash
chown root:root /var/www/html
find /var/www/html -type f -exec chmod 644 {} \;
find /var/www/html -type d -exec chmod 755 {} \;
```
## 二、目录与文件安全
### 1. 禁止目录浏览

- **配置文件路径**：`/etc/httpd/conf/httpd.conf`
- **操作步骤**：
```plain
Options FollowSymLinks  # 删除 Indexes 参数
```
- **检测方法**：访问无默认页面的目录，确认不显示文件列表。
### 2. 限制敏感目录执行权限

- **操作步骤**：
```plain
<Directory "/var/www/html/upload">
    <FilesMatch "\.(php|php4|php5)$">
        Order allow,deny
        Deny from all
    </FilesMatch>
</Directory>
```
### 3. 删除默认文件

- **操作步骤**：
```bash
rm -rf /usr/local/apache2/htdocs/*
rm -rf /usr/local/apache2/cgi-bin/*
rm -rf /usr/local/apache2/manual
```
## 三、日志配置
### 1. 启用详细日志记录

- **配置文件路径**：`/etc/httpd/conf/httpd.conf`
- **操作步骤**：
```plain
LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\"" combined
CustomLog "logs/access_log" combined
ErrorLog "logs/error_log"
LogLevel notice
```
### 2. 日志滚动与保留

- **操作步骤（Windows 示例）**：
```plain
CustomLog "|bin/rotatelogs.exe logs/access_%Y-%m-%d.log 86400"
```
## 四、访问控制
### 1. 限制 IP 访问后台

- **配置文件路径**：`/etc/httpd/conf/httpd.conf`
- **操作步骤**：
```plain
<Directory "/admin">
    Order Deny,Allow
    Deny from all
    Allow from 192.168.1.0/24
</Directory>
```
### 2. 禁止解析敏感文件类型

- **操作步骤**：
```plain
<FilesMatch "\.(inc|bak|log)$">
    Order allow,deny
    Deny from all
</FilesMatch>
```
## 五、服务配置优化
### 1. 隐藏版本信息

- **配置文件路径**：`/etc/httpd/conf/httpd.conf`
- **操作步骤**：
```plain
ServerTokens Prod
ServerSignature Off
```
### 2. 防止拒绝服务攻击

- **操作步骤**：
```plain
Timeout 10
KeepAlive On
KeepAliveTimeout 15
LimitRequestBody 102400  # 限制请求体大小为 100KB
```
### 3. 关闭 TRACE 方法

- **操作步骤**：
```plain
TraceEnable Off
<LimitExcept GET POST>
    Deny from all
</LimitExcept>
```
## 六、错误处理
### 1. 自定义错误页面

- **配置文件路径**：`/etc/httpd/conf/httpd.conf`
- **操作步骤**：
```plain
ErrorDocument 400 /error/400.html
ErrorDocument 404 /error/404.html
ErrorDocument 500 /error/500.html
```

## 七、其他加固项
### 1. 修改默认端口

- **配置文件路径**：`/etc/httpd/conf/httpd.conf`
- **操作步骤**：
```plain
Listen 8080  # 修改为非标准端口
```
### 2. 禁用不必要的模块

- **操作步骤**：
```plain
# 注释以下行禁用 CGI
# LoadModule cgi_module modules/mod_cgi.so
# ScriptAlias /cgi-bin/ "/var/www/cgi-bin/"
```
## 生效步骤

```bash
service httpd restart  # 重启 Apache 服务
```
## 检测工具

- 使用 `curl -I http://localhost` 检查响应头是否隐藏版本信息。
- 访问 `http://服务器 IP/不存在的路径` 验证自定义错误页面是否生效。
