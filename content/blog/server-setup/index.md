---
title: "Server Setup"
date: "2024-12-21"
category: "dev"
emoji: "🪵"
---

## 1. 修改主机名

`hostnamectl set-hostname 新的主机名`

vi /etc/hosts # 将 127.0.1.1 旧主机名 改为 127.0.1.1 新主机名

## 2. 配置 ssh

添加 ssh public keys 到 /root/.ssh/authorized_keys

修改 /etc/ssh/sshd_config

```
PubkeyAuthentication yes
PermitRootLogin prohibit-password
```

重启 `systemctl restart sshd`

## 3. 配置 zsh & oh-my-zsh

```
apt update
apt install -y zsh
apt install -y curl
apt install -y git
apt install -y vim
chsh -s $(which zsh)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
```

## 4. 配置 .zshrc

```
# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:$HOME/.local/bin:/usr/local/bin:$PATH

export ZSH="$HOME/.oh-my-zsh"
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="aussiegeek"
plugins=(git z zsh-autosuggestions)
source $ZSH/oh-my-zsh.sh

export LANG=en_US.UTF-8
export LANGUAGE="en_US"
export LC_ALL=en_US.UTF-8
export LS_OPTIONS='--color=auto'
# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='nvim'
# fi
alias vi="vim"
```

`source ~/.zshrc`


## 5. 配置 .vimrc

```
set encoding=utf-8
set fileencoding=utf-8
set termencoding=utf-8
set number 
set cursorline
set autoindent
set smartindent 
set tabstop=2
set shiftwidth=2
set expandtab
set ignorecase
set smartcase
set hlsearch
set incsearch
syntax on
set background=dark
colorscheme elflord
set timeoutlen=500
set updatetime=300
```

## 6. 配置 .tmux.conf

`apt install -y tmux`

```
unbind C-b
set -g prefix C-a
bind C-a send-prefix

set-option -g status-bg colour9
set-option -g status-fg colour46

bind-key -n M-Up select-pane -U
bind-key -n M-Down select-pane -D
bind-key -n M-Left select-pane -L
bind-key -n M-Right select-pane -R

set -g status-left-length 30
set -g status-right-length 30

set -g pane-border-style fg=brightblack
set -g pane-active-border-style fg=brightgreen

bind -r < resize-pane -L 2
bind -r > resize-pane -R 2
bind -r + resize-pane -U 1
bind -r - resize-pane -D 1

bind | split-window -h
bind - split-window -v
unbind '"'
unbind %

setw -g mode-keys vi
bind -T copy-mode-vi v send-keys -X begin-selection
bind -T copy-mode-vi y send-keys -X copy-pipe-and-cancel "xclip -selection clipboard -i"

set -g history-limit 10000
```
