---
title: "Git Commit Message Conventions"
date: "2020-03-13"
category: "dev"
emoji: "🙌🏻"
---

## 规范

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

#### type

- feat, 一个新的 feature
- fix, 一个 bug fix
- doc, 文档
- refactor, 重构
- perf, 性能优化
- test, 测试/重构测试
- style, 代码格式，样式，代码风格
- revert, 代码回滚
- chore, 调整项目配置，管理器，CI等配置内容

#### scope

影响范围，可以省略，比如 `feat(lang): add Chinese language`

#### subject

小写字母开始，不超过 50 个字符，结尾无标点，使用祈使句形式而非过去式形式

#### body

需要以第一人称说明 what 和 why, 每一行不超过 72 字符

#### footer

对 issue 的跟踪，或相关信息的 link

## 自动生成 ChangeLog

如果按照标准化的 commit message, 则可以用工具来提取过滤出 feat 和 fix 的信息比如:

```bash
$ git log --format='%s (%h)' --reverse --grep '^\(feat\|fix\)' --since=2020-01-01 --before=2020-02-01 | sed 's/([^)]*):/:/' | sort -k1,1 -s
```

可以添加到 `~/.gitconfig` 中:

```
[alias]
    change-of-last-month = !sh -c 'git log --format=\"%s (%h)\" --reverse --grep \"^\\(docs\\|feat\\|fix\\|perf\\|refactor\\|test\\)\" --since=`date -v-1m +\"%Y-%m-01\"` --before=`date +\"%Y-%m-01\"` | sed \"s/([^)]*):/:/\" | sort -k1,1 -s'
```

## 配置模板

#### 自定义模板

```
# feat/fix/docs/refactor/perf/test/style/revert/chore(scope/issue): changelog

# Modify issues if necessary
# Details if any
```

#### 添加到 git 配置中

```
git config --global commit.template path/to/template
```

或者在 `~/.gitconfig` 中手动添加:

```
[commit]
    template = path/to/template
```

#### 使用

提交代码时，使用 `git commit` 不带 `-m` 参数，即可使用模板


## 示例

#### 添加 `BREAKING CHANGE` 到 footer

```
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

#### 使用 `!` 着重表达

```
refactor!: drop support for Node 6
```

#### 可以不写 body

```
docs: correct spelling of CHANGELOG
```

## Refs

- [AngularJS Git Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.uyo6cb12dt6w)
- [Inkerk Blockchain Git Commit 风格指南](https://gitstyle.js.org/)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [what-the-commit](http://whatthecommit.com/)
- [cz-cli](https://github.com/commitizen/cz-cli#conventional-commit-messages-as-a-global-utility)
