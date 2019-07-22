---
title: "rsync"
date: "2019-07-22"
category: "dev"
emoji: "🚀"
---


## slash or not `SRC/` vs `SRC`

```
$ tree dir1
dir1
├── bar
└── foo
    └── README

$ rsync -a dir1 dir_bk
$ tree dir_bk
dir_bk
└── dir1
    ├── bar
    └── foo
        └── README

$ rm -rf dir_bk && mkdir dir_bk
$ rsync -a dir1/ dir_bk
$ tree dir_bk
dir_bk
├── bar
└── foo
    └── README
```

Without a slash on the source directory means copy both the source directory, and the contents (recursively if specified) to the destination directory while adding a trailing slash means only copy the contents of the source directory, recursively if specified, to the destination.


There’s no difference on the `DES`. A slash on the destination directory appears to have no effect.

## Other

```
            -v, --verbose           increase verbosity
            -a, --archive           archive mode; same as -rlptgoD (no -H)
            --delete                delete extraneous files from dest dirs
            --delete-before         receiver deletes before transfer (default)
            --delete-during         receiver deletes during xfer, not before
            --delete-after          receiver deletes after transfer, not befor
            -z, --compress          compress file data during the transfer
```

## Common Usage

```
rsync -avz --delete-after build/ root@100.100.100.100:/usr/share/nginx/project
```
