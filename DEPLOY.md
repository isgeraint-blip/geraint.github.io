# Jekyll 博客上线教程

本博客用 **Jekyll + GitHub Pages**，由 GitHub 官方服务器自动构建，本地无需装任何环境。

## 一、上传到 GitHub

### 1. 初始化并提交

```bash
cd D:\Projects\Github
git init
git add .
git commit -m "init: jekyll blog"
```

> 提交前自查（防止泄露密钥）：`git grep -nE "(key|token|password|secret)"`

### 2. 创建远程仓库并推送

GitHub 网页 → **New repository**（如 `blog`），**不要**勾选 README/.gitignore/license，然后：

```bash
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

> 首次 push 的密码填 **Personal Access Token**（Settings → Developer settings → PAT，勾 `repo` 权限）。

## 二、开启 GitHub Pages

1. 仓库 → **Settings** → 左侧 **Pages**
2. **Source** 选 `Deploy from a branch`
3. **Branch** 选 `main`，目录选 `/ (root)`
4. **Save**，等 1~2 分钟（GitHub 自动用 Jekyll 构建）

访问：`https://你的用户名.github.io/仓库名/`

## 三、站点地址配置（重要）

- 若地址是 `用户名.github.io/仓库名/`（项目站），打开 `_config.yml`，把
  `baseurl` 改成 `/仓库名`，否则资源路径会 404：

  ```yaml
  baseurl: /blog
  ```

- 若你用的是 `用户名.github.io`（用户站，仓库名正好是 `用户名.github.io`），`baseurl` 留空即可。

## 四、后续发文章

```bash
# 1. 在 _posts/ 新建 YYYY-MM-DD-标题.md
# 2. 提交推送
cd D:\Projects\Github
git add .
git commit -m "update: 新增文章 xxx"
git push
```

GitHub 会自动重新构建，1~2 分钟后生效。

## 五、本地预览（可选，不装也行）

```bash
# 需要 Ruby 环境
gem install bundler jekyll
bundle exec jekyll serve
# 打开 http://localhost:4000
```

> 不想装 Ruby 就跳过，直接用 GitHub Pages 在线构建即可。