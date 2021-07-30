/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 *
 * 如果目标值存在返回下标，否则返回 -1
 * @param nums int整型一维数组 
 * @param target int整型 
 * @return int整型
 */
 function search( nums ,  target ) {
  // write code here
  let low = 0;
  let high = nums.length - 1;
  let mid;
  while (low <= high) {
      mid = Math.floor((low + high) / 2);
      if (target === nums[mid]) {
          while (nums[mid] === nums[mid - 1] && mid > 0) {
              mid--;
          }
          return mid;
      } else if (nums[mid] < target) {
          low = mid + 1;
      } else {
          high = mid - 1;
      }
  }
  return -1;
}
module.exports = {
  search : search
};