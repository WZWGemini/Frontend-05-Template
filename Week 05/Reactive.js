let reactivities = new WeakMap(); // 用于存储已经reactive的对象
let callbacks = new WeakMap(); // watchEffect callbacks 依赖收集
let usedReactivities = []; // 用于收集watchEffect中callback用到了哪些Reactive对象
/**
  实现代理普通Object的Reactive
*/
function reactive(object) {
  if(reactivities.has(object)) return reactivities.get(object);
  let proxy = new Proxy(object, {
    set: (target, prop, value) => {
        target[prop] = value;
        if (callbacks.get(target)) {
          if(callbacks.get(target).get(prop)) {
            for (const cb of callbacks.get(target).get(prop)) {
              cb();
            }
          }
        }
        return target[prop];
    },
    get: (target, prop) => {
      usedReactivities.push([target, prop]);
      if(typeof target[prop] === "object") return reactive(target[prop]); // 深层reactive
      return target[prop];
    }
  })
  reactivities.set(object, proxy);
  return proxy;
}

/**
  effect实现
*/
function effect(callback) {
  usedReactivities = []; // 重置
  callback(); // 执行一次 在get中收集callback使用到的reactive对象
  for (const reactivity of usedReactivities) {
        if (!callbacks.has(reactivity[0])) {
          /** 非空初始化 */
          callbacks.set(reactivity[0], new Map());
        }
        if(!callbacks.get(reactivity[0]).has(reactivity[1])) {
          /** 非空初始化 */
          callbacks.get(reactivity[0]).set(reactivity[1], []);
        }
        callbacks.get(reactivity[0]).get(reactivity[1]).push(callback);
      }
    };