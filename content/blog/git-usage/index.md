---
title: "Git 速记"
date: "2018-10-12"
category: "dev"
emoji: "💥"
---

一直想写 Git 的笔记, 但是 Git 知识点太零散了, 并且 Git 又太强大了, 常用/不常用操作随便搜索一下就可以在爆栈网上找到.



所以在这里记录一下自己常用 git 操作.

### All in one

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/1539328637990.png" width="700" />


### Add

```bash
$ git add . # add current dir all changes and untracked
$ git add * # add new or modified even ignored but not add deleted change
$ git add file # add file
$ git add -A # same as add .
```

### Delete

```bash
$ rm abc
$ git add abc # or git rm abc
$ touch new_file
$ git add new_file
$ git rm --cached new_file # make new_file from staged to unstaged
```

### Status

```bash
$ git st # alias for git status
$ gst # alias in oh-my-zsh
```

### Commit

```bash
$ git commit -m 'bla'
$ git ci -m 'bla....' # alias
```

### Push

```bash
$ git push # push to current branch
$ git push --set-upstream origin master # first push
$ git push -u origin master # same above
```

### Show remote address

```bash
$ git remote -v
```

### Show branches

```bash
$ git branch
$ git branch -a # see remote branch too
$ git branch -a -v # see branch with commit
```

### Branches

```bash
$ git checkout master # change to master branch
$ git checkout -b new_branch # create new branch
$ git branch new_branch && git checkout new_branch # same above
$ git push -u origin new_branch # push to origin

$ git branch -d feature/login # delete local
$ git push origin --delete feature/login # delete origin

$ git fetch && git checkout new_branch # checkout remote branch
```

Create branch based on old commit

```bash
$ git checkout 1a08cbf
$ git branch new_branch

$ git branch new_branch 1a08cbf # same above
```


### Stash

```bash
$ git stash # stash all changes (not untracked)
$ git stash list
stash@{0}: WIP on master: 049d078 added the index file
stash@{1}: WIP on master: c264051 Revert "added file_size"
stash@{2}: WIP on master: 21d80a5 added number to log

$ git stash pop # first in last out (move out stash)

$ git stash apply # Like pop, but do not remove the state from the stash list.
$ git stash drop # delete last, these two equal to pop
```

### Log

```bash
$ git lg   # alias lg for log
$ git lg -p # with patch

$ git fetch
$ git lg origin/master # show origin master log
```

```
lg = log --graph --abbrev-commit --decorate --all --format=format:'%C(bold blue)%h%C(reset) - %C(bold cyan)%     aD%C(dim white) - %an%C(reset) %C(bold green)(%ar)%C(reset)%C(bold yellow)%d%C(reset)%n %C(white)%s%C(reset)'
```

### Log line history

```bash
$ git log --pretty=short -u -L 155,155:git-web--browse.sh # -u for patch, -L for line range
```


### tag

```bash
$ git tag # list all tags
v1.0
v1.1
$ git tag -l "v1.8.5*" # list all similarly v1.8.5
v1.8.5
v1.8.5-rc0
v1.8.5-rc1
v1.8.5-rc2
v1.8.5-rc3
v1.8.5.1
v1.8.5.2

$ git tag v1.1 # add v1.1 to current commit
$ git tag -a v1.2 -m 'my version 1.2' # add Annotated tag and message
$ git tag -a v1.3 9fceb02 # tag commit 9fceb02 to v1.3

$ git push origin v1.5 # push to origin v1.5
$ git push origin --tags # push all tags

$ git tag -d v1.4-lw # delete tag
$ git push origin :refs/tags/v1.4-lw # delete tag remote

$ git checkout -b version2 v2.0.0 # new branch version2 of v2.0.0 tag
$ git reset --hard v2.0.0 # reset to v2.0.0 tag commit
```

### Checkout

```bash
$ git checkout branch

## git checkout [<tree-ish>] [--] <pathspec>…​
$ git checkout file # change file back to unchanged state
$ git checkout -- file # same above, -- to differentiate file or branch
$ git checkout 7de7c6d a # change file to 7de7c6d state
$ git checkout 7de7c6d . # change current dir file to 7de7c6d state
```

### Clean

```bash
$ git clean -n # list what would deleted
$ git clean -f # clean

$ git clean # fail
fatal: clean.requireForce defaults to true and neither -i, -n, nor -f given; refusing to clean

$ git clean -f -d # remove directories
$ git clean -fd # same above

$ git clean -f -X # remove ignored files
$ git clean -fX # same above

$ git clean -f -x # remove ignored and non-ignored files
$ git clean -fx # same above
```

### Diff

```bash
$ git diff # diff current working tree and the index

$ git diff filename # diff file

$ git diff --cached # diff staged and HEAD

$ git diff --cached filename # diff file in stage and HEAD

$ git diff ffd98b2 b8e7b00 # diff two commit

$ git diff ffd98b2:filename b8e7b00:filename # diff file with two commit
```

### Show

```bash
$ git show
```

### Merge

```bash
$ git checkout master
$ git merge dev # merge dev to master
$ git branch -d dev
```

### Rebase

```bash
[branch_name]$ git rebase # rebase current to branch.<branch_name>.remote
```

```
          A---B---C topic
         /
    D---E---F---G master
```

```bash
$ git rebase master
$ git rebase master topic # same above
```

would be:

```
                  A'--B'--C' topic
                 /
    D---E---F---G master
```


#### Advanced

```
    o---o---o---o---o  master
         \
          o---o---o---o---o  next
                           \
                            o---o---o  topic
```


```bash
$ git rebase --onto master next topic
```

would be:

```
    o---o---o---o---o  master
        |            \
        |             o'--o'--o'  topic
         \
          o---o---o---o---o  next
```


### Revert

Revert some existing commits

```bash
$ git checkout master
$ git merge bug-fix-01
$ git revert 100ab89
```



```
    100ab89
  -----*-------*
                \
                 \
---o----o---------o-----o----> master
               merge revert
```

```bash
$ git revert -n 100ab89
$ git revert -n 101cf77
$ git revert -n 4a1bp99
$ git commit -m "revert3"
```

```

----o------o-----------o----------> master
  merge  revert     revert3
```

### reset

```bash
$ git reset # opposite of `git add` (only file change, if file add, using `git rm --cached`)
```

```bash
$ git reset --soft HEAD^ # take off last commit
```

```bash
$ git reset --hard HEAD^
```

same above:

```bash
$ git reset --soft HEAD^
$ git reset HEAD .
$ git checkout .
```

```bash
$ git branch topic/wip     # create new branch
$ git reset --hard HEAD~3  # make master back to old 3 commit (HEAD -> master)
$ git checkout topic/wip   # go on working on new branch (HEAD -> topic/wip)
```

如果上例中在 `reset --hard` 之前没有创建 branch, 那么这3条 commits 会丢失, 想要找回需要用 `reflog` 查看 `commit<sha1>`, 再 `reset --hard <sha1>`:

```bash
$ git reflog
82bffc2 HEAD@{0}: reset: moving to HEAD^
02ca477 (HEAD -> tmp) HEAD@{1}: commit: append a
$ git reset --hard 02ca477
```



### Show a file change history

#### 1. gitk

```bash
$ gitk file
```

#### 2. git blame (last modified)

```bash
$ git blame -L 20,30 README.md # -L20,+10
9cce7e0a (Henry   2019-01-23 14:37:11 +0800 10)
^a1f4fba (Henry   2019-01-08 12:45:41 +0800 11) ## Available Scripts
^a1f4fba (Henry   2019-01-08 12:45:41 +0800 12)
^a1f4fba (Henry   2019-01-08 12:45:41 +0800 13) In the project directory, you can run:
^a1f4fba (Henry   2019-01-08 12:45:41 +0800 14)
8d48cd57 (FaiChou 2019-01-30 09:57:46 +0800 15) ### `npm start` or `yarn start`
^a1f4fba (Henry   2019-01-08 12:45:41 +0800 16)
^a1f4fba (Henry   2019-01-08 12:45:41 +0800 17) Runs the app in the development mode.<br>
^a1f4fba (Henry   2019-01-08 12:45:41 +0800 18) Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
^a1f4fba (Henry   2019-01-08 12:45:41 +0800 19)
^a1f4fba (Henry   2019-01-08 12:45:41 +0800 20) The page will reload if you make edits.<br>
$ git show a1f4fba
```

### patch

#### create patch

```bash
$ git format-patch 2fba5b6^..dc131a9 # spawn 3 patch files
0001-create-c-d.patch
0002-modify-d.patch
0003-modify-a.patch

$ git format-patch master --stdout > tmp.patch # current branch diff master patch
$ git format-patch 2fba5b6^..dc131a9 --stdout > tmp.patch # `2f` to `dc` (attention the caret after `2f`)

$ git diff > diffs # for unstaged changes
$ git diff --cached > diffs # for staged changes
```

#### check the patch

```bash
$ git checkout master
$ git apply --stat tmp.patch # look at what changes are in the patch
$ git apply --check tmp.patch # if no errors, the patch can be applied cleanly
```

#### apply the patch

apply patches

```bash
$ git am --signoff < tmp.patch
```

> In you git log, you’ll find that the commit messages contain a “Signed-off-by” tag. This tag will be read by Github and others to provide useful info about how the commit ended up in the code.


apply diff outputs

```
$ git apply diffs
```

### .gitignore

[有关.gitigore中*.json 为何能递归匹配所有文件夹下 json 文件的讨论.](https://www.v2ex.com/t/453798)

- ignore 某文件夹下所有文件: `node_modules/`
- ignore 所有 json 类型文件: `*.json`
- 排除某 json 不被 ignore: `!abc.json`

### re-ignore already ignored file

```bash
$ git rm -r --cached . && git add . # alias reignore
```

### workflow

```bash
$ git add . && git ci -m "some work" # a
$ git fetch                          # b
$ git rebase                         # c
$ git push                           # d
```

> **git rebase `<upstream>`**
> If `<upstream>` is not specified, the upstream configured in branch.`<name>`.remote and branch.`<name>`.merge options will be used 

after a:

```
--o--o--o--o`  HEAD -> master
```

after b:

```
--o--o--o--o`  HEAD -> master
         \
          \
           o^  (origin/master, origin/HEAD)
```

after c:

```
     (origin/master, origin/HEAD)
           |
--o--o--o--o^--o` HEAD -> master
```

after d:

```
--o--o--o--o^--o` (HEAD -> master, origin/master)
```


### Reference

- [Pull VS Fetch](https://ruby-china.org/topics/15729)
- [Git原理入门](http://www.ruanyifeng.com/blog/2018/10/git-internals.html)
- [The meaning of the caret before git commit when doing blame](https://stackoverflow.com/questions/11915954/whats-the-meaning-of-the-caret-character-on-the-very-beginning-of-sha1-of-commi)

