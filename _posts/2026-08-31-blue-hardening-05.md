---
layout: post
title: "Tomcat安全加固"
date: 2026-08-31
categories: ["蓝队", "安全加固", "中间件加固"]
---

> **阵营**：蓝队　**分类**：蓝队 / 安全加固 / 中间件加固

## 一、账号与权限管理
### 1. 用户帐号设置

- **配置文件路径**：`tomcat/conf/tomcat-users.xml`
- **操作步骤**：
```xml
<user username="tomcat" password="Tomcat!234" roles="admin"/>
```
- **检测方法**：
```bash
ps -ef | grep tomcat  # 确认进程以 tomcat 用户运行
```
### 2. 删除或锁定无效账号

- **配置文件路径**：`tomcat/conf/tomcat-users.xml`
- **操作步骤**：
```xml
<!-- 删除与工作无关的账号 -->
<!-- <user username="tomcat1" password="tomcat" roles="admin"/> -->
```
- **检测方法**：查看配置文件，确认无关账号已被注释或删除。
## 二、目录与文件安全

### 1. 禁止目录浏览

- **配置文件路径**：`tomcat/conf/web.xml`
- **操作步骤**：
```xml
<init-param>
    <param-name>listings</param-name>
    <param-value>false</param-value>
</init-param>
```
- **检测方法**：访问无默认页面的目录，确认不显示文件列表。
### 2. 删除默认文件

- **操作步骤**：
```bash
rm -rf /usr/local/tomcat/webapps/docs
rm -rf /usr/local/tomcat/webapps/examples
rm -rf /usr/local/tomcat/webapps/manager
rm -rf /usr/local/tomcat/webapps/host-manager
rm -rf /usr/local/tomcat/webapps/ROOT
```
## 三、日志配置
### 1. 启用详细日志记录

- **配置文件路径**：`tomcat/conf/server.xml`
- **操作步骤**：
```xml
<Valve className="org.apache.catalina.valves.AccessLogValve"
       directory="logs"
       prefix="localhost_access_log."
       suffix=".txt"
       pattern="common"
       resolveHosts="false"/>
```
### 2. 日志滚动与保留

- **操作步骤**：
```xml
<Valve className="org.apache.catalina.valves.AccessLogValve"
       directory="logs"
       prefix="localhost_access_log_"
       suffix=".log"
       pattern="combined"
       resolveHosts="false"/>
```
## 四、访问控制
### 1. 限制 IP 访问后台

- **配置文件路径**：`tomcat/conf/server.xml`
- **操作步骤**：
```xml
<Valve className="org.apache.catalina.valves.RemoteAddrValve"
       allow="192.168.1.0/24"/>
```
### 2. 禁止解析敏感文件类型

- **配置文件路径**：`tomcat/conf/web.xml`
- **操作步骤**：
```xml
<mime-mapping>
    <extension>inc</extension>
    <mime-type>text/plain</mime-type>
</mime-mapping>
<mime-mapping>
    <extension>log</extension>
    <mime-type>text/plain</mime-type>
</mime-mapping>
```
## 五、服务配置优化
### 1. 隐藏版本信息

- **配置文件路径**：`tomcat/conf/server.xml`
- **操作步骤**：
```xml
<Server port="8005" shutdown="SHUTDOWN">
    <Service name="Catalina">
        <Connector port="8080" protocol="HTTP/1.1"
                   connectionTimeout="20000"
                   redirectPort="8443"
                   server="Server"/>
    </Service>
</Server>
```
### 2. 防止拒绝服务攻击

- **配置文件路径**：`tomcat/conf/server.xml`
- **操作步骤**：
```xml
<Connector port="8080" maxHttpHeaderSize="8192"
           maxThreads="150" minSpareThreads="25"
           maxSpareThreads="75"
           enableLookups="false"
           redirectPort="8443"
           acceptCount="100"
           connectionTimeout="30000"
           disableUploadTimeout="true"/>
```
### 3. 关闭 TRACE 方法

- **配置文件路径**：`tomcat/conf/web.xml`
- **操作步骤**：
```xml
<security-constraint>
    <web-resource-collection>
        <url-pattern>/*</url-pattern>
        <http-method>TRACE</http-method>
    </web-resource-collection>
    <auth-constraint/>
</security-constraint>
```
## 六、错误处理

### 1. 自定义错误页面

- **配置文件路径**：`tomcat/conf/web.xml`
- **操作步骤**：
```xml
<error-page>
    <error-code>404</error-code>
    <location>/noFile.htm</location>
</error-page>
<error-page>
    <error-code>500</error-code>
    <location>/error500.htm</location>
</error-page>
```

## 七、其他加固项
### 1. 修改默认端口

- **配置文件路径**：`tomcat/conf/server.xml`
- **操作步骤**：
```xml
<Connector port="8081" protocol="HTTP/1.1"
           connectionTimeout="20000"
           redirectPort="8443"/>
```
### 2. 禁用不必要的模块

- **配置文件路径**：`tomcat/conf/server.xml`
- **操作步骤**：
```xml
<!-- 禁用 CGI 模块 -->
<!-- <LoadModule cgi_module modules/mod_cgi.so> -->
```
## 生效步骤

```bash
bin/shutdown.sh  # 停止 Tomcat 服务
bin/startup.sh   # 启动 Tomcat 服务
```
## 检测工具

- 使用 `curl -I http://localhost:8080` 检查响应头是否隐藏版本信息。
- 访问 `http://服务器 IP:8080/不存在的路径` 验证自定义错误页面是否生效。
