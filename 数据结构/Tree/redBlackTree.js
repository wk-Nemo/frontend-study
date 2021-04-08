function Node (key, value, color) {
    this.key = key
    this.value = value
    this.left = null
    this.right = null
    // color是布尔值，true表示红色，false表示黑色
    this.color = color
}

class RedBlackTree {
    constructor (root, N) {
        // 根节点 
        this.root = root
        // 元素的个数
        this.N = N
    }

    isRed (x) {
        if (x && x.color === true) {
            return true
        } else {
            return false
        }
    }

    // 左旋
    rotateLeft (h) {
        // h节点右节点
        var hRight = h.right
        // h节点右节点的左节点
        var lhRight = hRight.left
        h.right = lhRight
        hRight.left = h
        hRight.color = h.color
        h.color = true
        return hRight
    }

    // 右旋
    rotateRight (h) {
        var hLeft = h.left
        var rhLeft = hLeft.right
        h.left = rhLeft
        hLeft.right = h
        hLeft.color = h.color
        h.color = true
        return hLeft
    }

    // 颜色反转
    flipColoes (h) {
        h.color = true
        h.left.color = false
        h.right.color = false
    }

    // 整个树上完成插入操作
    put (key, val) {
        this.root = this.putInTree(this.root, key, val)
        this.root.color = false
    }

    // 在指定树中完成插入操作
    putInTree (h, key, val) {
      if (h === null) {
        this.N++
        return new Node(key, val, true)
      }

      if (key < h.key) {
        // 查找左子树
        h.left = this.putInTree(h.left, key, val)
      } else if (key > h.key) {
        h.right = this.putInTree(h.right, key, val)
      } else {
        h.value = val
      }

      if (!this.isRed(h.left) && this.isRed(h.right)) {
          h = this.rotateLeft(h)
      }

      if (this.isRed(h.left) && this.isRed(h.left.left)) {
          h=this.rotateRight(h)
      }

      if (this.isRed(h.left) && this.isRed(h.right)) {
          this.flipColoes(h)
      }
      return h
    }

    get (key) {
        return this.getInTree(this.root, key)
    }

    getInTree (x, key) {
        if (x === null) {
            return null
        }

        if (key < this.root.key) {
            this.getInTree(x.left, key)
        } else if (key > root.key) {
            this.getInTree(x.right, key)
        } else {
            return x.value
        }
    }
}

const bt = new RedBlackTree(null, 0)
bt.put(4, "二哈")
bt.put(1, "张三")
bt.put(3, "李四")
bt.put(5, "王五")
console.log(bt.N)
console.log(bt.root)