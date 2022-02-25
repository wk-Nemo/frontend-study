/**
  * 
  * @param s string字符串 
  * @return bool布尔型
  */
 function isValid( s ) {
  // write code here
  let map = new Map([
      ['(', ')'],
      ['[', ']'],
      ['{', '}'],
  ])
  let stack = [];
  for (let i = 0; i < s.length; i++) {
      if (map.has(s[i])) {
          stack.push(map.get(s[i]))
      } else {
          if (!(stack.pop() === s[i])) {
              return false;
          }
      }
  }
  if (stack.length === 0) {
      return true;
  } else {
      return false;
  }
}

module.exports = {
  isValid : isValid
};