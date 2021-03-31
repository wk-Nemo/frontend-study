const deepClone = (target) => {
    const cloneTarget = Array.isArray(target) ? [] : {}
    if (typeof target === 'object' && target !== null) {
        // 是对象或者数组的情况
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloneTarget[key] = deepClone(obj[key])
            } else {
                cloneTarget[key] = obj[key]
            }
        }
    }
    return cloneTarget
}

JSON.parse(JSON.stringify())