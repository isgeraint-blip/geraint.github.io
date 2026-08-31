---
layout: page
title: Wiki
permalink: /wiki/
---

安全知识库，按方向分类整理：

<ul class="wiki-cat-list">
  <li>
    <a class="wiki-cat-link" href="{{ "/wiki/pentest/" | relative_url }}">
      <span class="wiki-cat-name">渗透测试</span>
      <span class="wiki-cat-count">{{ site.wiki | where: "group", "渗透测试" | size }} 篇文档</span>
    </a>
  </li>
  <li>
    <a class="wiki-cat-link" href="{{ "/wiki/hardening/" | relative_url }}">
      <span class="wiki-cat-name">安全加固</span>
      <span class="wiki-cat-count">{{ site.wiki | where: "group", "安全加固" | size }} 篇文档</span>
    </a>
  </li>
  <li>
    <a class="wiki-cat-link" href="{{ "/wiki/incident/" | relative_url }}">
      <span class="wiki-cat-name">应急响应</span>
      <span class="wiki-cat-count">{{ site.wiki | where: "group", "应急响应" | size }} 篇文档</span>
    </a>
  </li>
</ul>