class Heap {
    constructor (arr) {
        // 使用数组表示堆，注意不使用T[0]
        this.T = arr
    }

    // 判断堆i处的索引是否小于j
    less (i, j) {
        if (this.T[i] < this.T[j]) {
            return true
        } else {
            return false
        }
    }

    // 交换堆i和j处索引的值
    exch (i, j) {
        var temp = this.T[i]
        this.T[i] = this.T[j]
        this.T[j] = temp
    }

    // 删除堆中最大的元素，并返回在这个值
    delMax () {
        this.exch(1, this.T.length - 1)
        this.T[this.T.length - 1] = null
        this.sink(1)
    }

    // 向堆中插入一个元素
    insert (t) {
        this.T.push(t)
        this.swim(this.T.length - 1)
    }

    // 使用上浮算法，使索引k处的元素能处在堆中的一个正确的位置
    swim (k) {
        while (k > 1) {
            if (this.less(Math.floor(k / 2), k)) {
                this.exch(Math.floor(k / 2), k)
                k = Math.floor(k / 2)
            } else {
                break
            }
        }
    }

    // 使用下沉算法，使索引k处的元素能在堆中处于一个正确的位置
    sink (k) {
        while (2 * k < this.T.length - 1) {
            if (this.less(2 * k, 2 * k + 1)) {
                if (this.less(k, 2 * k + 1)) {
                    this.exch(k, 2 * k + 1)
                    k = 2 * k + 1
                } else {
                    break
                }
            } else {
                if (this.less(k, 2 * k)) {
                    this.exch(k, 2 * k)
                    k = 2 * k
                } else {
                    break
                }
            }
        }
    }
}

const arr = [undefined, 10, 7, 9, 4, 3, 1]

let heap = new Heap(arr)

heap.insert(11)
heap.delMax()
heap.delMax()

console.log(heap.T)