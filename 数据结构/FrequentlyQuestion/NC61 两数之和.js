/**
  * 
  * @param numbers int整型一维数组 
  * @param target int整型 
  * @return int整型一维数组
  */
 function twoSum( numbers ,  target ) {
  // write code here.
  let map = new Map()
  for (let i = 0; i < numbers.length; i++) {
      if (!map.has(numbers[i])) {
          map.set(target - numbers[i], i);
      } else {
          return [map.get(numbers[i]), i]
      }
  }
}

module.exports = {
  twoSum : twoSum
};