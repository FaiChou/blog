---
title: "My NVIM"
date: "2023-10-13"
category: "dev"
emoji: "🦹‍♀️"
---


```
$ alias vi="nvim"
```

## Install NeoVIM

```
$ brew install neovim
```

## Install some dependencies

```
$ brew install lazygit
$ brew install ripgrep
$ brew tap homebrew/cask-fonts
$ brew install font-hack-nerd-font
```

Also need set the iTerm2 font to `font-hack-nerd-font`.

## Install LazyVIM

follow this: https://www.lazyvim.org/installation

Here's my configration: https://github.com/FaiChou/my-lazy-nvim

## Shortcuts

Escape some vim shortcuts..

`cmd+/` to show cursor(which is iTerm2 feature, not vim)

`ctrl+hjkl` move between windows

`ctrl+up down left right` set app window size or position(which is Raycast feature, not vim)

`shift+h l` swap buffers, which `[b` `]b` `<leader>bb` also do the same

`<leader>bd` close buffer

`<c-s>` save file

`K` or `<leader>K` keywordprg, to show the function/keyword man page

`<leader>l` lazy

`<leader>fn` new file

`<leader>cf` code format

`<leader>gg` lazygit

`<leader>ghb` git blame

`<leader>qq` quit all

`c-/` toggle terminal on float window

`<leader>w` for windows

`<leader>-` `<leader>|` split window vertical horizontal

`<leader><tab>` for tabs

`gd` go definition, gD(eclaration)

~~`s` flash search `S` block selection~~

`s` for replace character and insert mode

`S` for delete current line and insert mode

`<leader>e` toggle neo-tree, also in tree, using `?` to show help

`<leader>,` check buffers

`<leader>/` root dir grep find

`<leader><space>` find file, same as `<leader>ff`

`<leader>fr` find recent files

`gcc` comment & cancel comment, also works in v mode

`{visual}gJ` join lines, `:.j` join current line and next line, `:%j` all line join, `:.,+4j`, `:.,$j`..

`gf` open file on cursor

`gv` re-select last visual text

`:%y` copy all file text, also `%` is a read-only register for file name

`:vertical resize +10` increase current window size if there's vertical (left right) windows

`resize +10` increase current window size if there's horizontal windows(up and down)

`<c-space>` to increase selection

`]p` paste with auto format

## Insert mode

`<C-w>` delete before word

`<C-c>` quit insert mode

`<C-r>` 0 paste with register 0(copied)

`<C-j>` or `<C-m>` new line


## My set

```
// plugins/neotree.lua
return {
  "nvim-neo-tree/neo-tree.nvim",
  opts = {
    window = {
      mappings = {
        ["o"] = "open",
      },
    },
  },
}
```

```
// config/keymaps.lua
local map = vim.keymap.set
map("i", "<C-f>", "<right>", { desc = "go forward" })
map("i", "<C-b>", "<left>", { desc = "go backward" })
map("i", "<C-n>", "<down>", { desc = "go down a line" })
map("i", "<C-p>", "<up>", { desc = "go up a line" })
map("i", "<C-e>", "<esc>A", { desc = "go to line end" })
map("i", "<C-d>", "<right><bs>", { desc = "delete back a character" })
```

```
// config/options.lua
local opt = vim.opt
opt.relativenumber = false
```
