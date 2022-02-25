class HeapSort {
    constructor (arr) {
        // 使用数组表示堆，注意不使用T[0]
        this.T = arr
    }

    // 对数组进行堆排序
    // 思路：每次将数组第一位的最大数拿出来，和最后一位数进行交换；再对1进行下沉
    sort () {
        for (let i = this.T.length - 1; i > 1; i--) {
            this.exch(1, i)
            // console.log('exch:', this.T)
            this.sink(1, i - 1)
            // console.log('sink:', this.T)
        }
    }

    // 创造堆
    // 思路1：依次从数组里拿一个数进添加到数组尾部，进行上浮
    // 思路2：复制数组，从数组一半处从右向左扫面，对每个元素做下沉
    creatHeap () {
        for (let i = Math.floor(this.T.length / 2); i >= 1; i--) {
            this.sink(i, this.T.length - 1)
        }
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
    sink (k, len) {
        while (2 * k <= len) {
            let max
            if (2 * k + 1 <= len && this.less(2 * k, 2 * k + 1)) {
                max = 2 * k + 1
            } else {
                max= 2 * k
            }
            if (this.less(k, max)) {
                this.exch(k, max)
                k = max
            } else {
                break
            }
        }
    }
}

const arr = [undefined, 5, 1, 3, 4, 9, 7, 10, 0, 11, 5, 6, 7, 3, 5, 6, 76, 4, 454, 53, 2423, 54, 41, 89]

const heap = new HeapSort(arr)

console.log(heap.T)

heap.creatHeap()

console.log(heap.T)

heap.sort()

console.log(heap.T)

//https://blog.csdn.net/zyq522376829/article/details/47686867
// 亿万级别的数据里面查找最大的10000个
// 取前10000个数据构造最小堆
// 遍历剩余的数据，与堆顶进行比较，如果比堆顶大则交换并下沉。