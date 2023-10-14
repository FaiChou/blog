---
title: "vim cheatsheet"
date: "2018-06-04"
category: "dev"
emoji: "✌🏻"
---

## 目录

1. which vim
2. Exiting
3. Navigating
4. Editing
5. Clipboard
6. Operators
7. Text objects
8. Find and replace
9. Repeat
10. Register
11. Buffer
12. Window
13. Tab
14. Dir
15. Other
16. Nerdtree
17. OtherPlugins


## which vim

```bash
$ which vim
/usr/local/bin/vim
```

系统的vim没有系统剪贴板功能, 所以用`brew`安装一个支持系统剪贴板的.

```bash
$ vim --version | grep "clipboard"
+clipboard         +jumplist          +persistent_undo   +virtualedit
-ebcdic            -mouseshape        +statusline        -xterm_clipboard
```

## Exiting

```bash
<ESC>        # to normal mode
:q           # quit
shift z z    # quit
:wq / :x     # save and close
:qa          # close all
:q!          # close file, abandon changes

,w           # write (my Leader is ,)
,q           # quit

```

## Navigating

```bash
h j k l          # move one character

<C-U> / <C-D>    # move half page
<C-F> / <C-B>    # move one page

b / w            # previous / next word
e / ge           # previous / next end of word

0                # start of line
^                # start of line (after whitespace)
$                # end of line

gg               # first line
G                # Last line
:n               # to line n
nG               # to line n

zz               # center this line
H                # move to top of screen
M                # move to middle of screen
L                # move to bottom of screen

```

## Editing

```bash
a       # append
A       # append on tail
i       # insert
I       # insert on head
o       # next line
O       # previous line
s       # delete char and insert
S       # delete line and insert
C       # delete until end of line and insert
r       # replace one character
R       # enter Replace mode
```

## Clipboard

```bash
x       # delete character
dd      # delete line (cut)
yy      # yank line (copy)
p       # paste
P       # paste before
```

## Operators


```bash
d       # delete
y       # yank (copy)
c       # change (delete then insert)
>       # indent right
<       # indent left
=       # auto indent
~       # swap case for current character
g~      # swap case
gU      # uppercase
gu      # lowercase
!       # filter through external program
```

```bash
cc           # delete line and to insert mode
dd           # delete line
yy           # copy line
guu/gugu     # lowercase all
gUU/gUgU     # uppercase all
g~~/g~g~     # swap case all
>>           # line right indent
<<           # line left indent
==           # line auto indent
```

## Text objects

```bash
p          # paragraph
w          # word
s          # sentence
[ ( { <    # a [], (), or {} block
b          # a block [(
B          # a block in [{
t          # a XML tag block
' " `      # A quoted string
```

## Find and replace

```bash
fn          # find next n in this line
Fn          # find previous n in this line
tn          # till next n in this line
Tn          # till previous n in this line

/foo        # find foo
/foo\c      # find foo FOO (ignore case)

?foo        # find foo previous
?foo\c      # find foo FOO previous

n / N       # next / previous one

*           # find cursor word (foo -> foo but not foobar)
g*          # find cursor word (foo -> foo, foobar)

#           # find cursor word previous

:{range}s/{old}/{new}/{flag}

:s/foo/bar/g        # current line substitute
:%s/foo/bar/g       # all file
:'<,'>s/foo/bar/g   # visual mode selection
:5,12s/foo/bar/g    # line 5~12
:.,$s/foo/bar/g     # current line to end line
:.,+2s/foo/bar/g    # current line and next 2 lines

# flag: g(global) i(ignore case) c(need confirm)

:%s/foo/bar # replace once
:%s/foo/bar/i # same as :%s/foo\c/bar
:%s/foo/bar/gc # will popup confirm

# replace with bar (y/n/a/q/l/^E/^Y)?
# yes no all quit line ~

:set hls # highlight search
:set ic  # ignore case
:set is  # show partial matches for a search phrase
:set nu  # show line numbers
:set et|retab  # convert tabs to spaces

:set noic
:set nohls
:set nois
:set nonu
:set et|retab!

# example

yiw # yank inner word 'first'
# move cursor to 'second'
viwp # select 'second' and paste with 'first'
# move cursor to 'third'
viw"0p # select 'third' and paste with first

yiw # yank inner word 'first'
# move cursor to 'second'
ciw<C-R>0<ESC> # change 'second' replace with first
# move cursor to 'third'
. # repeat the operation
```

## Repeat

```bash
.    # repeat last change
u    # undo
<C-r> # redo

;    # line find repeat
,    # line find previous repeat

n    # find repeat
N    # find previous repeat

&    # substitute repeat
u    # undo

@{reg} # macro repeat

```

## Register

There are ten types of registers:

1. The unnamed register ""
2. 10 numbered registers "0 to "9
3. The small delete register "-
4. 26 named registers "a to "z or "A to "Z
5. three read-only registers ":, "., "%
6. alternate buffer register "#
7. the expression register "=
8. The selection and drop registers "*, "+ and "~
9. The black hole register "_
10. Last search pattern register "/

```bash
:reg     # show named registers and what's in them
"+y      # copy to system clipboard
"+p      # paste from system clipboard
p        # just paste for ""
"0p      # 0 always keep copyed
```


## Buffer

```bash

vim file1 file2 # open
:e[dit] file3   # open 

:ls, :buffers   # list buffers
:bn[ext]        # list next buffer
:bp[revious]    # list previous buffer
:b {number, expression}     # jump to buffer

:sb 3            # split window to open buffer 3
:vertical sb 3   # split vertical window to open buffer 3
```

## Window

```bash
vim -O file1 file2

:sp[lit] {file}     # horizontal split
:new {file}         # horizontal split
:vs[plit] {file}    # vertical split
:clo[se]            # close current window

Ctrl+w s        # split current window
Ctrl+w v        # split vertical current window
Ctrl+w q        # close current window
Ctrl+w n        # open new empty window
Ctrl+w o        # close all other window

Ctrl+w h        # left window
Ctrl+w j        # bottom window
Ctrl+w k        # up window
Ctrl+w l        # right window
Ctrl+w w        # traverse windows

Ctrl+w H        # move left window
Ctrl+w J        # move bottom window
Ctrl+w K        # move up window
Ctrl+w L        # move right window

Ctrl+w +        # increase height
Ctrl+w -        # decrement height
Ctrl+w =        # set same height
```


## Tab

```bash
vim -p file1 file2 file3 # open in tabs

:tabe[dit] {file}   # edit specified file in a new tab
:tabc[lose]         # close current tab
:tabc[lose] {i}     # close i-th tab
:tabo[nly]          # close all other tabs (show only the current tab)

:tabn         # go to next tab
:tabp         # go to previous tab
:tabfirst     # go to first tab
:tablast      # go to last tab

gt            # go to next tab
gT            # go to previous tab
{i}gt         # go to tab in position i 

```


## Dir

```bash
:echo @%                # src/file1
:echo expand('%:t')     # file1
:echo expand('%:p')     # /home/FaiChou/Desktop/Project/A/src/file1
:echo expand('%:p:h')   # /home/FaiChou/Desktop/Project/A/src
:echo expand('%:p:h:t') # src

# p(path) h(head) t(tail) 

:w %.bak        # backup current to current.bak
:e %:p:h/main.h # open current path's main.h
"%p             # insert current path

:!ls            # bash ls
:!rm foo.txt    # bash rm
```

## Other

> When writing in insert mode, it’s possible to paste a register at the current location without leaving insert mode. To do this, press `CTRL-R` then type the name of a register. For example, `CTRL-R` a will insert the contents of `a`.



```bash
ggvGy   # copy all
ggyG    # copy all
:%y     # copy all

dt"     # delete till next "
di(     # delete inner ()
da(     # delete a ()

yi"     # copy inner ""
ya"     # copy a "" (include "")
yaw     # copy a word
yas     # copy a sentense
yap     # copy a paragraph

ds"     # delete surround ""
cs"'    # change surrond " to '

:.,+9s/new/<C-R>0/g # replace new to regster0 from current to next 9 lines

:2,4j   # join line 2-4

# insert mode shortcuts
<C-W> # delete before cursor words
<C-[> # quit insert mode
<C-C> # quit insert mode
<C-R> 0 # insert copied
<C-N> n n n # auto complete
<C-P> p p p # auto complete
<C-J> # new line
<C-M> # new line

# Leader
let mapLeader = ","
nnoremap <leader>w :w<CR>
nnoremap <leader>q :q<CR>

# number plus and subtract

<C-a> # add 1
<C-x> # minus 1
10<C-a> # add 10

# macro

1. abc # cursor in 1, need insert zzz to 2
2. def
3. ghi
4. jkl

qa # start record, to register a
j # remove to next line
<C-a> # add 1
q # quit record
3@a # do macro 6 times

:'<,'>normal @a # macro in visual


# match block
%  # match ([{}])
```

## Nerdtree

```bash
?: toggle help

# File
o: open in prev window
go: preview
t: open in new tab
T: open in new tab silently
i: open split
gi: preview split

# Directory

o: open & close node
O: recursively open node
t: open in new tab
T: open in new tab silently
x: close parent of node
X: close all child nodes of current node recursively

# Filesystem

u: move tree root up a dir
U: move tree root up a dir but leave old root open
r: refresh cursor dir
R: refresh current root
m: Show menu


# Tree navigation

P: go to root 
p: go to parent
K: go to first child
J: go to last child

# Other

q: Close the NERDTree window
A: Zoom (maximize-minimize)
```

## OtherPlugins

```bash
# rename.vim
:rename abc.js

# vim-mkdir
:e a/b/c/d.js (where you open vim)

# ctrlp
<c-d> toggle file or path search
<c-j>/<c-k>,<up>/<down>  switch
<enter>/<c-t> open / open in tab
```

