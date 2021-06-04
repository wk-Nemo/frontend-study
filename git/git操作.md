## git 学习

## 本地仓库操作篇

### 1. 创建分支

新建分支并切换到该分支下
```
git checkout -b name
```
相当于
```
git branch name
git checkout name
```



### 2. 提交

```
git add .
git commit -m 'fix: 修复bug'
```



### 3. 合并分支

merge

```
git merge name
```

rebase

```
git rebase main
```



### 4. 回退版本

HEAD 是引用，可以指向以前提交过的commit

```
git checkout 
```

本地回退上一个版本，在远程分支上没有改变
```
git reset HEAD^
```

在远程分支上回退一个版本，相当于撤销了该本版的改变回归到和上一个commit的版本，再提交到最新的分支后面

```
git revert HEAD
```



### 5. 在分支拉去主分支

```
git pull origin main
```



### 6. 高级应用

```
git checkout main
git cherry-pick c1 c2 c3
```

按顺序将从c1、c2、c3的`commit`放在`main`分支后



```
git rebase -i 
```

打开rebase UI界面，当 rebase UI界面打开时, 你能做3件事:

- 调整提交记录的顺序（通过鼠标拖放来完成）
- 删除你不想要的提交（通过切换 `pick` 的状态来完成，关闭就意味着你不想要这个提交记录）
- 合并提交。 它允许你把多个提交记录合并成一个。



## 远程仓库操作篇

```
git clone
```

远程仓库名一般叫origin

orgin/main 远程分支下的main分支

### 拉取远程仓库

```
git fetch
```

- 从远程仓库下载本地仓库中缺失的提交记录
- 更新远程分支指针(如 `o/main`)

ps：`git fetch` 并不会改变你本地仓库的状态。它不会更新你的 `main` 分支，也不会修改你磁盘上的文件。



```
git pull

//相当于
git fetch
git merge origin/main
```



```
git push
```

将本地的commit推到远程仓库















