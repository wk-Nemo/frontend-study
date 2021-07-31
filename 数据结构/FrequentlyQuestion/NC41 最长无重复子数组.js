/**
 * 
 * @param arr int整型一维数组 the array
 * @return int整型
 */
 function maxLength( arr ) {
  // write code here
  let pre = 0;
  let cur = 0;
  let maxLen = 0;
  while(cur < arr.length) {
      let set = new Set();
      while (!set.has(arr[cur]) && cur < arr.length) {
          set.add(arr[cur]);
          cur++;
      }
      maxLen = Math.max(maxLen, cur - pre);
      pre++;
      cur = pre;
  }
  return maxLen;
}
module.exports = {
  maxLength : maxLength
};

/**
 * 
 * @param arr int整型一维数组 the array
 * @return int整型
 */
 function maxLength( arr ) {
  // write code here
  let start = 0;
  let maxLen = 0;
  let map = new Map();
  for (let i = 0; i < arr.length; i++) {
      if (map.has(arr[i])) {
          start = Math.max(map.get(arr[i]) + 1, start);
      }
      map.set(arr[i], i);
      maxLen = Math.max(maxLen, i - start + 1);
  }
  return maxLen;
}
module.exports = {
  maxLength : maxLength
};