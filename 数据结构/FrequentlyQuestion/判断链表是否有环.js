/*
 * function ListNode(x){
 *   this.val = x;
 *   this.next = null;
 * }
 */

/**
 * 
 * @param head ListNode类 
 * @return bool布尔型
 */
// 如果存在环，则快慢指针肯定会走到环上
// 因为快指针每次比慢指针多走一步，所以肯定会遇上
 function hasCycle( head ) {
  // write code here
  if (head == null) {
      return false;
  }
  var slow = head;
  var fast = head;
  while (fast !== null && fast.next !== null) {
      slow = slow.next;
      fast = fast.next.next;
      if (slow === fast) {
          return true;
      }
  }
  return false;
}
module.exports = {
  hasCycle : hasCycle
};