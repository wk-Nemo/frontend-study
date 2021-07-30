function ReverseList(pHead)
{
    // write code here
    if (pHead == null) {
        return pHead;
    }
    let pre = pHead.next;
    let cur = null;
    while (pre) {
        pHead.next = cur;
        cur = pHead;
        pHead = pre;
        pre = pHead.next;
    }
    pHead.next = cur;
    return pHead;
}
module.exports = {
    ReverseList : ReverseList
};