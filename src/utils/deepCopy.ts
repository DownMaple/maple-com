/**
 * 深拷贝一个对象
 * @param obj - 要拷贝的对象
 * @returns - 拷贝后的对象
 */
export function deepCopy<T>(obj: T): T {
  // 如果 obj 是空值或者是基本数据类型，直接返回 obj
  if (obj === null || typeof obj!== 'object') {
    return obj;
  } else if (obj instanceof Date) {  // 如果 obj 是 Date 类型，创建一个新的 Date 对象并赋值为 obj 的时间戳，然后将该对象类型转换为 any 类型并返回
    return new Date(obj.getTime()) as any;
  }
  const result: any = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
    }
  }
  return result;
}