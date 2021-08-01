/*
 * function ListNode(x){
 *   this.val = x;
 *   this.next = null;
 * }
 */

/**
  * 
  * @param l1 ListNode类 
  * @param l2 ListNode类 
  * @return ListNode类
  */
 function mergeTwoLists( l1 ,  l2 ) {
  // write code here
  const pHead = {
      next: null
  }
  let pre = pHead;
  while (l1 || l2) {
      if (!l2 || (l1 && l1.val < l2.val)) {
          let next = l1.next
          pre.next = l1;
          l1 = next;
      } else {
          let next = l2.next;
          pre.next = l2;
          l2 = next;
      }
      pre = pre.next
  }
  return pHead.next;
}

module.exports = {
  mergeTwoLists : mergeTwoLists
};