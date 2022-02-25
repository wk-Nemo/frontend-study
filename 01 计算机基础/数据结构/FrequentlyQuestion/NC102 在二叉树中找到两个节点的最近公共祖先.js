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
 * @param o1 int整型 
 * @param o2 int整型 
 * @return int整型
 */
 function lowestCommonAncestor( root ,  o1 ,  o2 ) {
  // write code here
  return dfs(root, o1, o2).val;
}

function dfs(root ,  o1 ,  o2) {
  if (root == null || root.val == o1 || root.val == o2) {
      return root;
  }
  let left = dfs(root.left, o1, o2)
  let right = dfs(root.right, o1, o2)
   //如果left、right都不为空，那么代表o1、o2在root的两侧，所以root为他们的公共祖先
  if (left != null && right != null) {
      return root;
  }
  //如果left、right有一个为空，那么就返回不为空的哪一个
  return left != null ? left : right
}
  
module.exports = {
  lowestCommonAncestor : lowestCommonAncestor
};