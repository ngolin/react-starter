/* eslint-disable react-hooks/refs */
import { useRef } from 'react';

/**
 * useRefCallback - 使用 ref 保存回调的 Hook
 *
 * 特点：
 * 1. 返回的 callback 引用始终保持不变
 * 2. callback 内部总能获取到最新的 props/state
 * 3. 不会因为依赖变化而重新创建函数
 */
export const useRefCallback = <T extends (...args: any[]) => any>(callback: T): T => {
  // 用 ref 保存最新的 callback
  const callbackRef = useRef(callback);

  // 每次渲染后更新 ref 中的 callback
  callbackRef.current = callback;

  // Stable wrapper type matching callback's parameters and return
  const stableCallback = useRef<(...args: Parameters<T>) => ReturnType<T>>((...args: Parameters<T>) => {
    return callbackRef.current(...(args as any)) as ReturnType<T>;
  });

  return stableCallback.current as T;
};
