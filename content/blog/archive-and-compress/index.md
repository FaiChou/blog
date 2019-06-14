---
title: "压缩解压与打包解包"
date: "2019-06-14"
category: "dev"
emoji: "📦"
---

## Archive VS Compress

多个文件打包成一个文件利于传输/备份, 这里是 **Archive**.

大文件压缩成小文件可以节省磁盘空间和利于网络下载, 这里是 **Compress**.

打包和压缩是两个非常重要的概念, 尤其是区分这两者.
打包文件是一系列文件/文件夹的组合, 包文件占据相同或者更大的磁盘空间.
压缩文件是一系列文件/文件夹的特殊组合, 它占据更小的磁盘空间.

## Compress tools

#### bzip2/bunzip2

```bash
$ ls
file1
$ bzip2 file1
$ ls
file1.bz2 # remove original file
$ bunzip2 file1.bz2
$ ls
file1 # remove zipped file
```

#### gzip/gunzip

```bash
$ ls
file1
$ gzip file1
$ ls
file1.gz # remove original file
$ gunzip file1.gz
$ ls
file1 # remove zipped file

$ gzip -d file1.gz # also can decompress
$ ls
file1
```

## Archive tools

#### tar

- -c — create a new archive
- -f — when used with the -c option, use the filename specified for the creation of the tar file; when used with the -x option, unarchive the specified file
- -t — show the list of files in the tar file
- -v — show the progress of the files being archived
- -x — extract files from an archive
- -z — compress the tar file with gzip
- -j — compress the tar file with bzip2

```bash
$ tar -cvf a.tar f1 f2
$ ls
a.tar f1 f2

$ tar -tvf a.tar # list files
-rw-r--r--  0 FaiChou staff    2520 Jun 14 17:06 f1
-rw-r--r--  0 FaiChou staff     256 Jun 14 17:05 f2

$  tar -xvf a.tar # extract
x f1
x f2
```


## compress and archive

#### zip/unzip

```bash
$ ls
f1 f2 dir1
$ zip f.zip f1 f2
$ ls
f.zip f1 f2

$ unzip f.zip

$ zip -r f2.zip f1 f2 dir1 dir2 # 如果有文件夹也压缩, 那么一定要带上 -r, 否则文件夹里的文件会丢失

$ zip -e f3.zip f1 f2 # 加密压缩, 打开时候会弹出密码输入
```

#### tar

```bash
$ tar -cjvf b.tbz f1 f2 # zip f1 f2 to b.tbz (bz2)
a f1
a f2
$ ls
b.tbz f1 f2

$ tar -czvf c.tgz f1 f2 # zip f1 f2 to c.tgz (gzip)
a f1
a f2
$ ls
c.tgz f1 f2

$ tar -xjvf b.tbz # unzip tbz
x f1
x f2

$ tar -xzvf c.tgz # unzip tgz
x f1
x f2
```


## Ref

- [File Compression and Archiving](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/4/html/Step_by_Step_Guide/s1-managing-compressing-archiving.html)
- [Unpacking .tar.gz, .tar, or .zip files](http://magma.maths.usyd.edu.au/magma/faq/extract)
