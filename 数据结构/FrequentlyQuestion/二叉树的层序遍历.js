/*
 * function TreeNode(x) {
 *   this.val = x;
 *   this.left = null;
 *   this.right = null;
 * }
 */

/**
  * 
  * @param root TreeNode类 
  * @return int整型二维数组
  */
 function levelOrder( root ) {
  // write code here
  if (!root) {
      return []
  }
  
  let res = []
  let quene = [root]
  while(quene.length) {
      let tmpRes = [];
      let tmpQuene = quene.slice();
      for (let i = 0; i < tmpQuene.length; i++) {
          let tmp = quene.shift();
          tmpRes.push(tmp.val);
          if (tmp.left !== null) {
              quene.push(tmp.left);
          }
          if (tmp.right !== null) {
              quene.push(tmp.right);
          }
      }
      res.push(tmpRes);
  }
  return res;
}
module.exports = {
  levelOrder : levelOrder
};




















