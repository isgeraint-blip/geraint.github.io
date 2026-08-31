---
layout: page
title: "简化Linux基线安全检查"
group: "安全加固"
---

## 一、账户与身份认证
### 1.1 账户管理
#### 加固项

1. **删除无用账户**
```bash
# 检查非系统账户
awk -F: '($3 >= 1000) {print $1}' /etc/passwd
# 删除账户（示例）
userdel <username>
```

2. **锁定默认账户**
```bash
passwd -l root  # 禁止root直接登录（需先配置sudo）
```
#### 验证方式

```bash
cat /etc/passwd | grep -E "nologin|false"  # 确认无可用shell账户
```

### 1.2 密码策略

#### 配置文件
`/etc/login.defs` 和 `/etc/security/pwquality.conf`
#### 加固项

|   |   |
|---|---|
|参数|推荐值|
|PASS_MAX_DAYS|90|
|PASS_MIN_DAYS|7|
|PASS_WARN_AGE|14|
|minlen|12|
|minclass|4（含大小写/数字/符号）|

#### 生效命令

```bash
chage -M 90 <username>  # 修改现有用户密码有效期
```

## 二、SSH服务加固

### 2.1 配置文件修改
#### 文件路径
`/etc/ssh/sshd_config`
#### 关键配置项

```properties
PermitRootLogin no             # 禁止root登录
Protocol 2                     # 仅允许SSHv2
MaxAuthTries 3                 # 最大认证尝试次数
ClientAliveInterval 300        # 会话超时5分钟
AllowUsers user1 user2        # 仅允许指定用户登录
```
#### 生效命令

```bash
systemctl restart sshd
```

### 2.2 密钥认证强化
#### 操作步骤

1. 生成ED25519密钥：
```bash
ssh-keygen -t ed25519 -a 100
```

2. 禁用弱加密算法：

```properties
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com
```
#### 验证方式

```bash
ssh -Q cipher       # 查看支持的加密算法
sshd -T | grep permitroot  # 检查root登录状态
```

## 三、服务与进程管理

### 3.1 关闭高危服务
#### 服务列表

|   |   |
|---|---|
|服务名|操作|
|telnet.socket|`systemctl stop telnet.socket`|
|rpcbind|`systemctl disable rpcbind`|

#### 验证命令

```bash
netstat -tulnp | grep -E '23|111'  # 检查高危端口
```

### 3.2 文件权限控制
#### 关键文件权限

|   |   |
|---|---|
|文件路径|推荐权限|
|/etc/passwd|644|
|/etc/shadow|000|
|/var/log/secure|640|

#### 设置命令

```bash
chmod 000 /etc/shadow
chattr +i /etc/passwd  # 防止篡改（谨慎使用）
```

## 四、防火墙与网络防护
### 4.1 防火墙配置（firewalld）
#### 常用命令

```bash
firewall-cmd --permanent --add-service=ssh  # 放行SSH
firewall-cmd --permanent --remove-service=dhcpv6-client  # 关闭无用服务
firewall-cmd --reload
```
#### 基线规则

- 默认策略：`block`（入站）/ `allow`（出站）
- 仅开放业务必需端口（如80, 443, 自定义管理端口）
---

### 4.2 内核参数加固

#### 配置文件
`/etc/sysctl.conf`
#### 关键参数

```properties
net.ipv4.conf.all.rp_filter = 1          # 启用反向路径过滤
net.ipv4.icmp_echo_ignore_broadcasts = 1 # 忽略ICMP广播
kernel.kptr_restrict = 2                 # 限制内核地址泄露
```

#### 生效命令

```bash
sysctl -p
```

## 五、日志与审计

### 5.1 auditd 配置
#### 审计规则文件
`/etc/audit/audit.rules`

#### 关键审计项

```bash
-a always,exit -F arch=b64 -S execve  # 记录所有执行命令
-w /etc/passwd -p wa -k user_accounts  # 监控密码文件修改
```
#### 日志查询

```bash
ausearch -k user_accounts  # 按关键词检索
```

## 附录：合规检查清单
### 账户与SSH

|   |   |
|---|---|
|检查项|合格标准|
|root登录状态|PermitRootLogin=no|
|密码有效期|/etc/login.defs中PASS_MAX_DAYS≤90|

### 网络与日志

|   |   |
|---|---|
|检查项|合格标准|
|防火墙默认策略|入站默认拒绝|
|auditd服务状态|systemctl status auditd 显示active|

### 常用命令速查

```bash
检查开放端口
ss -tuln

查看最近登录记录
last -10

检查SUID文件
find / -perm /4000 -ls
```
