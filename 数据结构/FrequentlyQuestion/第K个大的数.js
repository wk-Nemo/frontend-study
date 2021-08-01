function quickSort(arr, begin, end, k) {
  if (begin > end) {
      return;
  }
  let tmp = arr[begin],
      i = begin,
      j = end;
  while (begin != end) {
      while (arr[end] <= tmp && end > begin) {
          end--;
      }
      while (arr[begin] >= tmp && end > begin) {
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
  if (end < k) {
      quickSort(arr, end + 1, j, k);
  } else if (end == k) {
      return;
  } else {
      quickSort(arr, i, end - 1, k);
  }
}

let arr = [1332802,1177178,1514891,871248,753214,123866,1615405,328656,1540395,968891,1884022,252932,1034406,1455178,821713,486232,860175,1896237,852300,566715,1285209,1845742,883142,259266,520911,1844960,218188,1528217,332380,261485,1111670,16920,1249664,1199799,1959818,1546744,1904944,51047,1176397,190970,48715,349690,673887,1648782,1010556,1165786,937247,986578,798663]
quickSort(arr, 0, arr.length - 1, 24);
console.log(arr)