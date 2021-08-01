/*
 * function ListNode(x){
 *   this.val = x;
 *   this.next = null;
 * }
 */

/**
  * 
  * @param head ListNode类 
  * @param k int整型 
  * @return ListNode类
  */
 function reverseKGroup( head ,  k ) {
  // write code here
  if (!head || !head.next || k == 1) return head
  let pre = null
  let cur = head
  let p = head
  let tmp = null
  for (let i = 0; i < k; i++) {
      if (!p) return head
      p = p.next
  }
  for (let j = 0; j < k; j++) {
      tmp = cur.next;
      cur.next = pre;
      pre = cur;
      cur = tmp;
  }
  head.next = reverseKGroup(cur, k)
  return pre;
}

module.exports = {
  reverseKGroup : reverseKGroup
};

























