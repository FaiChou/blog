---
title: "brew usage"
date: "2018-12-31"
category: "Dev"
description: "common command"
emoji: "👨🏼‍💻"
---

## search

```bash
$ brew search httpie
$ brew search cask
```

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/1546248589499.png" width="500" />



## install

```bash
$ brew install httpie # if just a command
$ brew cask wewechat # if is an app
```

## list outdated package

```bash
$ brew outdated
```

## upgrade

```bash
$ brew upgrade # upgrade all packages
$ brew upgrade httpie # update specific package
```

## update

```bash
$ brew update # update brew local mirror
```

## clean

```bash
$ brew cleanup # delete old and cache files
$ brew cleanup -n # list what will be cleaned up
```

## homepage

```bash
$ brew home httpie # visit httpie's homepage
```

## list

```bash
$ brew list
```

## check info

```bash
$ brew info httpie
```

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/1546249026298.png" width="500" />

## also

As we can see on the info page, packages are installed to `/usr/local/Cellar/` folder.

The normal flow is: `update` -> `upgrade` -> `cleanup`.



