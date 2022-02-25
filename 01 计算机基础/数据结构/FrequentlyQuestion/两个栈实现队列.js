let stack1 = [];
let stack2 = [];

function qPush(node)
{
    // write code here
    stack1.push(node);
}
function qPop()
{
    // write code here
    if (stack2.length == 0) {
        while (stack1.length != 0) {
            stack2.push(stack1.pop());
        }
    }
    return stack2.pop();
}
module.exports = {
    push : qPush,
    pop : qPop
};