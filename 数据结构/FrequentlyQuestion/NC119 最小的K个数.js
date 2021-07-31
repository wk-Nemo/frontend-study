function quickSort(arr, begin, end, k) {
  if (begin > end) {
    return arr;
  }
  let tmp = arr[begin];
  let i = begin;
  let j = end;

  while (begin != end) {
    while (arr[end] >= tmp && end > begin) {
      end--;
    }
    while (arr[begin] <= tmp && begin < end) {
      begin++;
    }
    if (begin < end) {
      let flag = arr[begin];
      arr[begin] = arr[end];
      arr[end] = flag;
    }
  }
  arr[i] = arr[end];
  arr[end] = tmp;
  if (end > k) {
    quickSort(arr, i, end - 1, k);
  } else if (end == k) {
    return;
  } else {
    quickSort(arr, end + 1, j, k);
  }
}
let arr = [4,5,1,6,2,7,3,8]

console.log(quickSort(arr, 0, arr.length - 1, 4))