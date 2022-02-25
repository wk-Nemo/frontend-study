/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
 var findMedianSortedArrays = function(nums1, nums2) {
  let pos1 = 0, pos2 = 0,  res
  let pos = Math.ceil((nums1.length + nums2.length) / 2)
  let flag = (nums1.length + nums2.length) % 2 == 0
  let pre = 0, cur = 0

  for (let i = 0; i < pos; i++) {
    pre = cur
    if (nums1[pos1] < nums2[pos2] && pos1 + 1 < nums1.length) {
      cur = nums1[pos1]
      pos1++
    } else {
      cur = nums2[pos2]
      pos2++
    }
  }
  return flag ? (pre + cur) / 2 : cur 
};

console.log(findMedianSortedArrays([1, 3], [2]))