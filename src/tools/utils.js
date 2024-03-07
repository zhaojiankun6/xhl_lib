// 对象数组扁平化
// objArray: 对象数组, childKey: 存放子对象数组的 key, depth: 扁平化深度, 默认 Infinity , 无限向下
export function flattenObjectArray(objArray, childKey = 'children', depth = Infinity) {
    let result = [];

    // 展开深度为 0 时，直接返回
    if (depth < 0) {
        return result;
    }

    // 先存放当前层级的对象数组
    result = result.concat(objArray);
    // 遍历当前层级的对象数组，如果有子对象数组，递归调用本方法，将结果合并到 result 中
    objArray.forEach(item => {
        if (Array.isArray(item[childKey])) {
            result = result.concat(flattenObjectArray(item[childKey], childKey, depth - 1));
        }
    });

    // 返回结果
    return result;
}