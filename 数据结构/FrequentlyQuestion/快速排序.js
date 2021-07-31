function quickSort(arr, begin, end) {
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
  quickSort(arr, i, end - 1);
  quickSort(arr, end + 1, j);
}

let arr = [49, 38, 65, 97, 76, 13, 27, 100, 200, 46, 27, 95, 65, 78, 99,101,20, 1,3,4,6,654,848,21,32,54]
// let arr = [4, 3, 2, 1]
quickSort(arr, 0, arr.length - 1);
console.log(arr);