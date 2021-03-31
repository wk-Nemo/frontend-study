// https://juejin.cn/post/6844904039566540808#heading-26
var num_0 = [49, 38, 65, 97, 76, 13, 27, 100, 200, 46, 27, 95, 65, 78, 99,101,20, 1,3,4,6,654,848,21,32,54]
// var num_1 = [49, 38, 65, 97, 76, 13, 27, 100, 200, 46, 27, 95, 65, 78, 99,101,20, 1,3,4,6,654,848,21,32,54]
// var num_0 = [49, 38, 65, 97, 76, 13, 27, 100]
var num_1 = [49, 38, 65, 97, 76, 13, 27, 100]

/* 交换排序 */
//冒泡排序：从小到大排序
function bubbleSort_1(nums) {
  for (var i=0; i<nums.length -1; i++) {
    for(var j=0; j<nums.length - i -1; j++) {
      if (nums[j] > nums[j+1]) {
        var tmp = nums[j]
        nums[j] = nums[j+1]
        nums[j+1] = tmp
      }
    }
  }
}

//冒泡排序：从大到小排序
function bubbleSort_2(nums) {
  for (var i=0; i<nums.length -1; i++) {
    for(var j=0; j<nums.length - i -1; j++) {
      if (nums[j] < nums[j+1]) {
        var tmp = nums[j]
        nums[j] = nums[j+1]
        nums[j+1] = tmp
      }
    }
  }
}

// 快速排序实现方式1
function quickSort(arr, begin, end) {
  if (begin > end) {
    return arr;
  }
  let tmp = arr[begin]
  let i = begin
  let j = end
  while (i != j) {
    while (arr[j] >= tmp && j>i) {
      j--
    }
    while (arr[i] <= tmp && j>i) {
      i++
    }
    if (i < j) {
      let k = arr[i]
      arr[i] = arr[j]
      arr[j] = k
    }
  }
  arr[begin] = arr[i]
  arr[i] = tmp 
  quickSort(arr, begin, i-1)
  quickSort(arr, i+1, end)
}

// 快速排序寻找中位数
function find_quickSort(arr, begin, end) {
  if (begin > end) {
    return arr;
  }
  let tmp = arr[begin]
  let i = begin
  let j = end
  while (i != j) {
    while (arr[j] >= tmp && j>i) {
      j--
    }
    while (arr[i] <= tmp && j>i) {
      i++
    }
    if (i < j) {
      let k = arr[i]
      arr[i] = arr[j]
      arr[j] = k
    }
  }
  arr[begin] = arr[i]
  arr[i] = tmp 
  if (i < Math.ceil(arr.length/2) -1) {
    quickSort(arr, begin, i-1)
  } else if (i > Math.ceil(arr.length/2)-1) {
    quickSort(arr, i+1, end)
  } else {
    return arr[Math.ceil(arr.length/2)-1]
  }
}

/* 插入排序 */
// 插入排序
function insertSort(arr) {
  let len = arr.length
  let preInt, current
  for (let i=1; i<arr.length; i++) {
    preInt = i - 1
    current = arr[i]
    while (preInt >= 0 && arr[preInt] > current) {
      arr[preInt + 1] = arr[preInt]
      preInt --
    }
    arr[preInt + 1] = current
    console.log(`第${i}次循环`, arr);
  }
}

// 折半插入排序
function binserSort(arr) {
  let low, high, temp, j
  for (let i = 1; i < arr.length; i++) {
    temp = arr[i]
    low = 0
    high = i - 1
    while (low <= high) {
      if (arr[Math.floor((low + high) / 2)] > temp) {
        high = Math.floor((low + high) / 2) - 1
      } else {
        low = Math.floor((low + high) / 2) + 1
      }
    }
    for (j = i; j>low; j--) {
      arr[j] = arr[j-1]
    }
    arr[low] = temp
  }
  return arr
}

// 希尔排序
// 希尔排序是设置一个增量，将数组进行分组进行插入排序，然后不断的降低增量进行插入排序

// 归并排序，分而治之
function mergeSort(arr) {
  let len = arr.length
  if (len < 2) {
    return arr
  }
  let middle = Math.floor(len / 2),
      left = arr.slice(0, middle),
      right = arr.slice(middle);
  console.log(`处理过程：`, arr)
  return merge(mergeSort(left),mergeSort(right))
}

function merge(left, right) {
  let result = []
  while (left.length && right.length) {
    if (left[0] > right[0]) {
      result.push(right.shift())
    } else {
      result.push(left.shift())
    }
  }
  while (left.length) {
    result.push(left.shift())
  }
  while (right.length) {
    result.push(right.shift())
  }
  return result
}

console.log(mergeSort(num_0))








