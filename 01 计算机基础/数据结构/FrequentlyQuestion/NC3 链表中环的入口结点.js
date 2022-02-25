/*function ListNode(x){
    this.val = x;
    this.next = null;
}*/

// 记住数学公式
// 或者使用set进行存储或遍历，但是会有额外的存储空间
function EntryNodeOfLoop(pHead)
{
    // write code here
    let fast = pHead;
    let slow = pHead;
    // false 表示没有环
    let flag = false; 
    while (fast && fast.next) {
        fast = fast.next.next;
        slow = slow.next;
        if (fast === slow) {
            flag = true;
            fast = pHead;
            break;
        }
    }
    if (flag) {
        while (fast !== slow) {
            fast = fast.next;
            slow = slow.next;
        }
        return fast;
    } else {
        return null;
    }
}

module.exports = {
    EntryNodeOfLoop : EntryNodeOfLoop
};