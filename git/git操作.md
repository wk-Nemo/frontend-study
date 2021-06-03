## git 学习

### 创建分支

新建分支并切换到该分支下
```
git checkout -b name
```
相当于
```
git branch name
git checkout name
```

### 提交
```
git add .
git commit -m 'fix: 修复bug'
```

### 合并分支
```
git merge name
bug test
```

### 回退版本
回退上一个版本
```
git reset HEAD^
```

