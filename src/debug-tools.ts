export function DEBUG_getPrivate<T>(obj: any, propName: string): T {
  return obj[propName]
}

export function DEBUG_callPrivate<R = void>(obj: any, methodName: string, ...args: any[]): R {
  return obj[methodName](...args);
}
