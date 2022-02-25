/*
 * function TreeNode(x) {
 *   this.val = x;
 *   this.left = null;
 *   this.right = null;
 * }
 */

/**
 * 递归的方法比较无脑，这边只记录非递归的方法
 * @param root TreeNode类 the root of binary tree
 * @return int整型二维数组
 */

 function threeOrders( root ) {
  // write code here
  const preResult = preOrder(root);
  const midResult = midOrder(root);
  const backResult = backOrder(root);
  return [preResult, midResult, backResult];
}

function preOrder(root) {
  const res = []
  const stack = []
  if (root) {
      stack.push(root)
  } else {
      return res
  }
  while (stack.length) {
      let node = stack.pop()
      res.push(node.val)
      if(node.right) stack.push(node.right);
      if(node.left) stack.push(node.left);
  }
  return res;
}

function midOrder(root) {
  const res = []
  const stack = []
  while (root || stack.length) {
      while(root) {
          stack.push(root);
          root = root.left;
      }
      let node = stack.pop();
      res.push(node.val);
      root = node.right
  }
  return res;
}

// 和中序遍历类似
// 但是要注意需要判断根节点是否被访问过
function backOrder(root) {
  const res = [];
  const stack = [];
  const set = new Set();
  while (root || stack.length) {
      while (root && !set.has(root)) {
          stack.push(root)
          root = root.left
      }
      let node = stack.pop();
      if (node.right && !set.has(node)) {
          set.add(node)
          stack.push(node)
          root = node.right
      } else {
          res.push(node.val)
      }
  }
  return res;
}

module.exports = {
  threeOrders : threeOrders
};
























