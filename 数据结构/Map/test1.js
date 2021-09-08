/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 *
 * 
 * @param tasks int整型 培训总数
 * @param prerequisites int整型二维数组 前置要求
 * @return bool布尔型
 */
 function solve( tasks ,  prerequisites ) {
  // write code here
  let map = []
  for (let i = 0; i < tasks; i++) map[i] = []

  let inDegree = new Array(tasks).fill(0)

  let len = prerequisites.length

  for (let i = 0; i < len; i++) {
    let [key, val] = prerequisites[i]
    map[key].push(val)
    inDegree[val]++
  }

  let queue = [], count = 0;
  inDegree.forEach((val, key) => {
    if (val === 0) queue.push(key)
  })

  while(queue.length) {
    count++;
    let item = queue.shift()
    let arr = map[item]
    for (let i = 0; i < arr.length; i++) {
      inDegree[arr[i]]--
      if (inDegree[arr[i]] == 0) queue.push(arr[i])
    }
  }

  return count === tasks
}


console.log(solve(3, [[0, 1], [1, 2], [2, 0]]))




