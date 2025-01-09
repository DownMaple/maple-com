export function isAllEmpty(val: any):boolean {
  // 判断 null 或 undefined
  if (val == null) return true;
  
  // 判断空字符串
  if (typeof val === 'string') return val === '';
  
  // 判断空数组
  if (Array.isArray(val)) return val.length === 0;
  
  // 判断空对象
  if (typeof val === 'object') {
    if (val instanceof Map || val instanceof Set) {
      return val.size === 0;
    }
    // 对象的判断需要检查是否有任何可枚举属性
    return Object.keys(val).length === 0;
  }
  
  // 对于其他类型（如数字、布尔值等），直接认为非空
  return false;
}
