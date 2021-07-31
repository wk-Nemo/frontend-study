/**
 * 
 * @param A int整型一维数组 
 * @param B int整型一维数组 
 * @return void
 */
 function merge( A, B) {
    // write code here
    let res = []
    while (A.length && B.length) {
        if (A[0] <= B[0]) {
            res.push(A.shift())
        } else {
            res.push(B.shift())
        }
    }
    while (A.length) {
        res.push(A.shift())
    }
    while (B.length) {
        res.push(B.shift())
    }
    return res
}

let A = [4,5,6]
let B = [1,2,3]
console.log(merge(A, B))

module.exports = {
    merge : merge
};