---
title: "Skip Some Commits When Doing Merge"
date: "2019-03-05"
category: "dev"
emoji: "📌"
---

<img src="https://raw.githubusercontent.com/FaiChou/faichou.github.io/master/img/1551792746051.png" width="600" />


## Question

How to skip some commits when doing merge? This situation is not a common one but an interesting one. Look at the picture above if you don't understand the question.

## Solution 1 - cherry-pick

```bash
[master]$ git cherry-pick 123474
[master]$ git cherry-pick 123475
```

And then the tree is like this:

```
              474  475
    ---o---o---o---o---> dev
   |
   |              351 474  475 
---o---o---o---o---o---o---o---> master
   
```

## Solution 2 - rebase

```bash
[bug]$ git branch temp 123475 # a
[bug]$ git rebase --onto master 123474^ temp # b
[bug]$ git checkout master # c
[master]$ git reset --hard temp # d
```


#### after a:

```
 o---o---o---o---o  master
         \
          o---o---o---o---o   bug
                           \
                            temp
```

#### after b:

```
                   o`---o` temp
                  /
 o---o---o---o---o  master
         \
          o---o---o---o---o   bug
```

#### after d:

```
 o---o---o---o---o---o`---o` HEAD -> master
         \
          o---o---o---o---o   bug
```

## Solution 3 - rebase -i

```bash
[dev]$ git checkout -b bug-to-merge-into-master
[bug-to-merge-into-master]$ git rebase -i 123471 123475
d 123471
d 123472
d 123473
p 123474
p 123475
[bug-to-merge-into-master]$ git checkout master
[master]$ git merge bug-to-merge-into-master
```

## Solution 4 - merge + revert

```bash
[master]$ git merge dev
[master]$ git revert -n 123471
[master]$ git revert -n 123472
[master]$ git revert -n 123473
[master]$ git commit -m "revert"
```

Now the tree is like this:

```
      471 472 473 474 475
    ---o---o---o---o---o
   |                    \
   |                      \
---o---o---o---o---o---o---o--------o----->master
                          merge   revert
```

## Solution 5 - using patch

```bash
[bug]$ git format-patch 123474^..123475 --stdout > ~/Downloads/part.patch
[bug]$ git checkout master
[master]$ git am --signoff < ~/Downloads/part.patch
```


## Reference

- [git-scm-git-cherry-pick](https://git-scm.com/docs/git-cherry-pick)
- [stackoverflow-727994](https://stackoverflow.com/questions/727994/git-skipping-specific-commits-when-merging)
- [patch](https://www.devroom.io/2009/10/26/how-to-create-and-apply-a-patch-with-git/)
- [cherry-picking-range-of-git-commits](https://feeding.cloud.geek.nz/posts/cherry-picking-range-of-git-commits/)
