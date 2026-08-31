# Geraint的技术博客

基于 [Jekyll](https://jekyllrb.com) + GitHub Pages 的个人技术博客，分享安全研究、漏洞挖掘、开发笔记。

## 内容结构

- **技术文章**（首页）`_posts/`：日常分享文章，按时间排列
- **Wiki 知识库**（`/wiki/`）：系统化手册文档
  - `渗透测试` → `_wiki/pentest/`
  - `安全加固` → `_wiki/hardening/`
  - `应急响应` → `_wiki/incident/`

## 目录结构

```
├─ _config.yml          # 站点配置（collections、导航）
├─ index.md             # 首页：技术文章
├─ wiki.md              # Wiki 入口
├─ wiki-pentest.md      # 渗透测试分类页
├─ wiki-hardening.md    # 安全加固分类页
├─ wiki-incident.md     # 应急响应分类页
├─ _posts/              # 技术文章（YYYY-MM-DD-标题.md）
├─ _wiki/               # Wiki 知识库（按分类分子目录）
│  ├─ pentest/          #   渗透测试
│  ├─ hardening/        #   安全加固
│  └─ incident/         #   应急响应
├─ _layouts/            # 页面模板
├─ assets/main.scss     # 自定义样式
├─ about.md             # 关于页
└─ SECURITY.md          # 发布前脱敏清单与合规规范
```

## 写文章

### 技术文章

在 `_posts/` 新建 `YYYY-MM-DD-标题.md`：

```yaml
---
layout: post
title: "文章标题"
date: 2026-08-31
---
正文...
```

### Wiki 文档

在 `_wiki/<分类目录>/` 新建文档（目录对应 pentest / hardening / incident）：

```yaml
---
layout: page
title: "文档标题"
group: "渗透测试"
---
正文...
```

push 后 GitHub 自动构建发布，无需本地环境。

## 安全

- 无第三方 CDN、无前端 JS 框架
- 发布前请阅读 [SECURITY.md](SECURITY.md) 脱敏自查