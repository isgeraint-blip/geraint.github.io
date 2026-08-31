# 我的技术博客

基于 [Jekyll](https://jekyllrb.com) + GitHub Pages 的个人技术博客，分享安全研究、漏洞挖掘、开发笔记。

## 目录结构

```
├─ _config.yml      # 站点配置（官方 minima 主题，无第三方 CDN）
├─ index.md         # 站点首页（自动列文章）
├─ about.md         # 关于页
├─ _posts/          # 文章目录（文件名 YYYY-MM-DD-标题.md）
└─ SECURITY.md      # 发布前脱敏清单与合规规范
```

## 写文章

在 `_posts/` 新建 `YYYY-MM-DD-标题.md`，头部加 front matter：

```yaml
---
layout: post
title: "文章标题"
date: 2026-08-31
categories: 分类
---
正文...
```

push 后 GitHub 自动构建发布，无需本地环境。

## 安全

- 无第三方 CDN、无前端 JS 框架
- 发布前请阅读 [SECURITY.md](SECURITY.md) 脱敏自查