function findCommon(arr1, arr2) {
    let map = new Set(arr1)
    let result = []
    for (let item of arr2) {
        if(map.has(item)) {
            result.push(item)
        }
    }
    return result
}

const arr1 = [1, 2, 3, 4]
const arr2 = [3, 4, 5, 6]
console.log(findCommon(arr1, arr2))