/**
 * max sum of the subarray
 * @param arr int整型一维数组 the array
 * @return int整型
 */
 function maxsumofSubarray( arr ) {
  // write code here
  let res = []
  res[0] = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
      if (res[i - 1] <= 0) {
          res[i] = arr[i]
      } else {
          res[i] = arr[i] + res[i-1]
      }
      max = Math.max(max, res[i])
  }
  return max
}

// 优化，看见复杂将为O(1)
function maxsumofSubarray( arr ) {
  let max = arr[0];
  let tmp = arr[0];
  for (let  i = 1; i < arr.length; i++) {
    if (tmp < 0) {
      tmp = arr[i]
    } else {
      tmp = tmp + arr[i]
    }
    max = Math.max(max, tmp)
  }
  return max
}

module.exports = {
  maxsumofSubarray : maxsumofSubarray
};