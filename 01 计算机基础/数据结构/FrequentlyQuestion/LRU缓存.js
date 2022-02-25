/**
 * lru design
 * @param operators int整型二维数组 the ops
 * @param k int整型 the k
 * @return int整型一维数组
 */
 function LRU( operators ,  k ) {
  // write code here
  const n = operators.length;
  const map = new Map();
  const res = [];
  for (let i = 0; i < n; i++) {
      if (operators[i][0] === 1) {
          set(operators[i][1], operators[i][2]);
      } else {
          res.push(get(operators[i][1]));
      }
  }
  function get(key) {
      const val = map.get(key);
      if (val === undefined) {
          return -1;
      }
      map.delete(key);
      map.set(key, val);
      return val;
  };
  function set(key, val) {
      if (map.has(key)) {
          map.delete(key);
      }
      map.set(key, val);
      if (map.size > k) {
          // map.keys()返回一个iterator，里面顺序记录了map.set的顺序
          // 因此map.keys().next()是最久远的设置的
          // 因此get()执行以后需要重新set
          map.delete(map.keys().next().value)
      }
  };
  return res;
}
module.exports = {
  LRU : LRU
};

