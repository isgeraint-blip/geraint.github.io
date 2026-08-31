---
layout: page
title: Wiki
permalink: /wiki/
---

安全知识库，按方向分类整理：

| 分类 | 简介 | 文档数 |
|---|---|---|
| [渗透测试]({{ "/wiki/pentest/" | relative_url }}) | SQL注入、RCE、文件上传、未授权访问等 | {{ site.wiki | where: "group", "渗透测试" | size }} |
| [安全加固]({{ "/wiki/hardening/" | relative_url }}) | 中间件、Linux/Windows 系统基线加固 | {{ site.wiki | where: "group", "安全加固" | size }} |
| [应急响应]({{ "/wiki/incident/" | relative_url }}) | 入侵排查、日志分析、应急流程 | {{ site.wiki | where: "group", "应急响应" | size }} |
{: .wiki-nav-table}