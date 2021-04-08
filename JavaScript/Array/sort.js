const insertSort = (arr, start = 0, end) => {
  end = end || arr.length
  for (let i = start; i < end; i++) {
    let j
    for (j = i; j > start && arr[j - 1] > arr[j]; j--) {
      let temp = arr[j]
      arr[j] = arr[j - 1]
      arr[j - 1] = temp
    }
  }
  return
}

