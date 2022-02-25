var arr=[3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
/**
 * 冒泡排序
 * 时间复杂度：O(N^2)
 * 空间复杂度：O(1)
 * 稳定性：稳定
 */
function bubbleSort(arr) {
  for(let i = 0; i < arr.length; i++) {
    for(let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let tmp = arr[j+1]
        arr[j + 1] = arr[j]
        arr[j] = tmp
      }
    }
  }
}
// bubbleSort(arr)
// console.log(arr)

/**
 * 选择排序
 * 时间复杂度：O(N^2)
 * 空间复杂度：O(1)
 * 稳定性：不稳定
 */
function selectSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;
    for (let j = i; j < arr.length; j++) {
      if(arr[j] < arr[min]) {
        min = j
      }
    }
    let tmp = arr[i]
    arr[i] = arr[min]
    arr[min] = tmp
  }
}
// selectSort(arr)
// console.log(arr)

/**
 * 插入排序
 * 时间复杂度：O(N^2)
 * 空间复杂度：O(1)
 * 稳定性：稳定
 */
function insertSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let key = arr[i]
    let j = i - 1
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = key
  }
}
// insertSort(arr)
// console.log(arr)

/**
 * 快速排序
 * 平均时间复杂度：O(nlogn)
 * 空间复杂度：O(logn)
 * 稳定性：不稳定
 */
function quickSort(arr, start, end) {
  if (start > end) {
    return
  }
  let flag = arr[start],
      i = start,
      j = end;
  while (start != end) {
    while(arr[end] >= flag && end > start) {
      end--
    }
    while(arr[start] <= flag && end > start) {
      start++
    }
    if (start < end) {
      let tmp = arr[start]
      arr[start] = arr[end]
      arr[end] = tmp
    }
  }
  arr[i] = arr[end]
  arr[end] = flag
  quickSort(arr, i, end - 1)
  quickSort(arr, end + 1, j)
}
// quickSort(arr, 0, arr.length - 1)
// console.log(arr)

/**
 * 归并排序
 * 平均时间复杂度：O(nlogn)
 * 空间复杂度：O(n)
 * 稳定性：不稳定
 */
function merge(left, right) {
  let result = []
  
  while(left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }

  while(left.length) {
    result.push(left.shift())
  }
  while(right.length) {
    result.push(right.shift())
  }
  return result
}

function mergeSort(arr) {
  let len = arr.length

  if (len < 2) {
    return arr
  }

  let mid = Math.floor(len / 2),
      left = arr.slice(0, mid),
      right = arr.slice(mid);

  return merge(mergeSort(left), mergeSort(right))
}
console.log(mergeSort(arr))

/**
 * 堆排序
 * 平均时间复杂度：O(nlogn)
 * 空间复杂度：O(1)
 * 稳定性：不稳定
 */

class Heap{
  constructor(arr) {
    this.T = arr
    this.createHeap()
  }

  sort() {
    for (let i = this.T.length - 1; i > 1; i--) {
      this.exch(1, i)
      this.sink(1, i - 1)
    }
  }

  createHeap() {
    for (let i = Math.floor(this.T.length / 2); i >= 1; i--) {
      this.sink(i, this.T.length - 1)
    }
  }

  less(i, j) {
    if(this.T[i] < this.T[j]) {
      return true
    }
    return false
  }

  exch(i, j) {
    var temp = this.T[i]
    this.T[i] = this.T[j]
    this.T[j] = temp
  }

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

  sink (k, len) {
    while (2 * k <= len) {
      let max
      if (2 * k + 1 <= len && this.less(2*k, 2*k + 1)) {
        max = 2*k + 1
      } else {
        max = 2*k
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

// const arr = [undefined, 5, 1, 3, 4, 9, 7, 10, 0, 11, 5, 6, 7, 3, 5, 6, 76, 4, 454, 53, 2423, 54, 41, 89]
var arr = [undefined, 3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];

const heap = new Heap(arr)
console.log(heap.T)

heap.sort()
console.log(heap.T)