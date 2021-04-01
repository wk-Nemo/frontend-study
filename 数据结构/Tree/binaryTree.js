function TreeNode(val, left, right) {
  this.val = (val===undefined ? 0 : val)
  this.left = (left===undefined ? null : left)
  this.right = (right===undefined ? null : right)
}

// 递归的前序遍历
function preorderTraversal_recursion(root) {
  const result = []
  function preOrderTraverseNode(root) {
     // 遍历根节点
     if(root) result.push(root.val)
     // 遍历左子树
     if(root.left) preOrderTraverseNode(root.left)
     // 遍历右子树
     if(root.right) preOrderTraverseNode(root.right)
  }
  preOrderTraverseNode(root)
  return result
}

// 迭代的前序遍历
function preorderTraversal_iteration(root) {
  const result = []
  // 递归本质上就是使用栈来实现的，依次迭代就是显示的调用栈
  const stack = []
  // 判断是否为空节点
  if (root) {
    stack.push(root)
  } else {
    return result
  }
  // 遍历树
  while (stack.length > 0) {
    // 弹出栈顶，相当于遍历根节点
    var top = stack.pop()
    result.push(top.val)
    // 因为栈是先进后出，所以先push右节点
    if(top.right) stack.push(top.right)
    // push左节点
    if(top.left) stack.push(top.left)
  }
  return result
}

// 递归的中序遍历 
function inorderTraversal_recursion(root) {
  const result = []
  function inorder(root) {
    if(root.left) inorder(root.left)
    result.push(root.val)
    if(root.right) inorder(root.right)
  }
  if(root) inorder(root)
  return result
}

// 迭代的中序遍历
function inorderTraversal_interation(root) {
  const result = []
  const stack = []
  while (root || stack.length) {
    while (root) {
      stack.push(root)
      root = root.left
    }
    var top = stack.pop()
    result.push(top.val)
    root = top.right
  }
  return result
}

// 递归的后序遍历
function postorderTraversal_recursion(root) {
  const result = []
  function postorder(root) {
    if(root.left) postorder(root.left)
    if(root.right) postorder(root.right)
    result.push(root.val)
  }
  if(root) postorder(root)
  return result
}

// 迭代的后序遍历
function postorderTraversal_interation(root) {
  const result = []
  const stack = []
  var pre = null
  while (root || stack.length) {
    while (root) {
      stack.push(root)
      root = root.left
    }
    var top = stack.pop()
    // 注意此处需要判断右子树是否被遍历过，从而决定是否去遍历根节点
    if (!top.right || top.right === pre) {
      result.push(top.val)
      pre = top
      root = null
    } else {
      stack.push(top)
      root = top.right
    }
  }
  return result
}

// 该层序遍历输出的是一维数组
function levelOrder(root) {
  const result = []
  const stack = []
  if(root) stack.push(root)
  while (stack.length) {
    var top = stack.pop()
    result.push(top.val)
    if(top.right) stack.push(top.right)
    if(top.left) stack.push(top.left)
  }
  return result 
}

// 该层序遍历输出的是二维数组
function levelOrder_s(root) {
  const result = []
  const stack = []
  if(root) stack.push(root)
  while (stack.length) {
    result.push([])
    var len = stack.length
    for (let i=0; i<len; i++) {
      var top = stack.shift()
      result[result.length-1].push(top.val)
      if(top.left) stack.push(top.left)
      if(top.right) stack.push(top.right)
    }
  }
  return result 
}

// 根据前序遍历和中序遍历寻找二叉树
var buildTree = function(preorder, inorder) {
  function findTree(prf, pre, inf, ine) {
      console.log(prf+" "+pre+" "+inf+" "+ine)
      if (prf > pre || inf > ine) {
        return null
      }
      var root = new TreeNode(preorder[prf])
      var pos = inorder.indexOf(preorder[prf])
      var len = pos - inf
      if(prf === pre || inf === ine) {
        return root
      } else {
        root.left = findTree(prf+1, prf+len, inf, pos-1)
        root.right = findTree(prf+1+len, pre, pos+1, ine)
        return root
      } 
  }
  if (preorder.length) {
     var root = findTree(0, preorder.length-1, 0, inorder.length-1) 
  } else {
      var root = null
  }
  return root
}

var root = new TreeNode(3)
root.left = new TreeNode(9)
root.right = new TreeNode(20)
root.right.left = new TreeNode(15)
root.right.right = new TreeNode(7)

var preorder = [3,9,20,15,7]
var inorder = [9,3,15,20,7]
console.log(buildTree(preorder, inorder))

