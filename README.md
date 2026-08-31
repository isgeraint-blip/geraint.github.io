# Geraint-博客

基于 [Jekyll](https://jekyllrb.com) + GitHub Pages 的个人技术博客，分享安全研究、漏洞挖掘、开发笔记。

## 内容结构

- **文章杂记**（首页）`_posts/`：日常分享文章，按时间排列
- **Wiki 知识库**（`/wiki/`）：系统化手册文档
  - `渗透测试` → `_wiki/pentest/`
  - `安全加固` → `_wiki/hardening/`
  - `应急响应` → `_wiki/incident/`

## 目录结构

```
├─ _config.yml          # 站点配置（collections、导航）
├─ index.md             # 首页：文章杂记
├─ wiki.md              # Wiki 入口
├─ wiki-pentest.md      # 渗透测试分类页
├─ wiki-hardening.md    # 安全加固分类页
├─ wiki-incident.md     # 应急响应分类页
├─ _posts/              # 文章杂记（YYYY-MM-DD-标题.md）
├─ _wiki/               # Wiki 知识库（按分类分子目录）
│  ├─ pentest/          #   渗透测试
│  ├─ hardening/        #   安全加固
│  └─ incident/         #   应急响应
├─ _layouts/            # 页面模板
├─ assets/main.scss     # 自定义样式
├─ about.md             # 关于页
└─ SECURITY.md          # 发布前脱敏清单与合规规范
```

## 安全

- 无第三方 CDN、无前端 JS 框架
- 发布前请阅读 [SECURITY.md](SECURITY.md) 脱敏自查

## 免责声明

本站所有内容仅供安全技术分享与学习，请遵循《中华人民共和国网络安全法》等相关法律法规，在授权前提下合理使用，严禁用于任何非法用途
