function shallowCopy (obj) {
    if (typeof obj !== 'object') {
        return 
    }
    let newObj = obj instanceof Array ? [] : {}
    for (let key in obj) {
        // in会遍历到原型
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key]
        }
    }
    return newObj
} 

const deepClone = (obj) => {
    const cloneTarget = Array.isArray(obj) ? [] : {}
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloneTarget[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
        }
    }
    return cloneTarget
}

var obj3 = {
    a: 'a3',
    b: [1, 2, 3],
    c: {
        a: 'a4',
        b: [1, 2, 3, 4],
        c: obj3
    }
}

var obj1 = {
    a: 'a',
    b: [1],
    c: obj3
}


const result = shallowCopy(obj1)
const result1 = deepClone(obj1)
console.log(result)
console.log(result1)