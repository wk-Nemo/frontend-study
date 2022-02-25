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

// let arr = [49, 38, 65, 97, 76, 13, 27, 100, 200, 46, 27, 95, 65, 78, 99,101,20, 1,3,4,6,654,848,21,32,54]
// let arr = [4, 3, 2, 1]
let arr = [1332802,1177178,1514891,871248,753214,123866,1615405,328656,1540395,968891,1884022,252932,1034406,1455178,821713,486232,860175,1896237,852300,566715,1285209,1845742,883142,259266,520911,1844960,218188,1528217,332380,261485,1111670,16920,1249664,1199799,1959818,1546744,1904944,51047,1176397,190970,48715,349690,673887,1648782,1010556,1165786,937247,986578,798663]
quickSort(arr, 0, arr.length - 1);
console.log(arr);