'use client';
/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { removeMut } from '@/lib/utils';

export class MetaState<T extends Record<string, unknown>> {
  protected subscriberList: Array<MetaState.Subscriber<T>> = [];
  protected subscribers: {
    [K in keyof T]?: Array<(value: T[K]) => void | boolean>;
  } = {};
  protected storage: T = {} as any;
  protected dispatchCount = 0;

  constructor(
    initialState?: T,
    public observer?: MetaState<MetaState.Observer<T>>,
  ) {
    if (initialState) {
      this.storage = { ...initialState };
    }
  }
  use<V>(reducer: (keys?: (keyof T)[]) => V): V;
  use<K extends keyof T, V = T[K]>(key: K, reducer?: (value: T[K]) => V): V;
  use<K extends keyof T, V = T[K]>(key: K | ((keys?: (keyof T)[]) => V), reducer?: (value: T[K]) => V) {
    const getValue = (keys?: (keyof T)[]) =>
      typeof key === 'function' ? key(keys) : reducer ? reducer(this.storage[key]) : this.storage[key];
    const getValueRef = useRef(getValue);
    getValueRef.current = getValue;

    const [value, setValue] = useState(getValue);

    useLayoutEffect(() => {
      setValue(getValueRef.current());
      if (typeof key !== 'function') {
        return this.subscribe(key, () => setValue(getValueRef.current()));
      } else {
        return this.subscribe(keys => setValue(getValueRef.current(keys)));
      }
    }, [typeof key === 'function' ? '' : key]);

    return value;
  }

  useDispatch<K extends keyof T>(key: K) {
    const dispatch = this.getDispatch(key);
    return useCallback(dispatch, [key]);
  }

  get(): T;
  get<K1 extends keyof T>(key: K1): T[K1];
  get<K1 extends keyof T, K2 extends keyof T>(key1: K1, key2: K2): [T[K1], T[K2]];
  get<K1 extends keyof T, K2 extends keyof T>(key1?: K1, key2?: K2): T | T[K1] | [T[K1], T[K2]] {
    return key2 !== undefined
      ? [this.storage[key1!], this.storage[key2]]
      : key1 !== undefined
        ? this.storage[key1]
        : this.storage;
  }

  subscribe<K extends keyof T>(key: K, subscriber: (value: T[K]) => void): () => void;
  subscribe(subscriber: MetaState.Subscriber<T>): () => void;
  subscribe<K extends keyof T>(key: K | MetaState.Subscriber<T>, subscriber?: (value: T[K]) => void) {
    switch (typeof key) {
      case 'string':
      case 'number':
      case 'symbol': {
        this.observer?.dispatch('subscribe', [key, subscriber] as any);
        this.subscribers[key] = this.subscribers[key] || [];
        this.subscribers[key].push(subscriber!);
        return () => {
          this.observer?.dispatch('unsubscribe', [key, subscriber] as any);
          removeMut(this.subscribers[key]!, subscriber);
        };
      }
      default: {
        this.observer?.dispatch('subscribe', key as any);
        this.subscriberList.push(key);

        return () => {
          this.observer?.dispatch('unsubscribe', key as any);
          removeMut(this.subscriberList, key);
        };
      }
    }
  }

  getDispatch<K extends keyof T>(key: K) {
    return (value: MetaState.Action<T[K]>) => this.dispatch(key, value);
  }

  dispatch(partial: Partial<{ [K in keyof T]: MetaState.Action<T[K]> }>): boolean;
  dispatch<K extends keyof T>(key: K, value: MetaState.Action<T[K]>): boolean;
  dispatch<K extends keyof T>(
    key: K | Partial<{ [K in keyof T]: MetaState.Action<T[K]> }>,
    value?: MetaState.Action<T[K]>,
  ): boolean {
    if (typeof key === 'object') {
      this.observer?.dispatch('dispatch', key);
      const keys = [] as (keyof T)[];
      for (const k in key) {
        if (this.dispatchPair(k, key[k]!)) {
          keys.push(k);
        }
      }
      if (keys.length) {
        this.dispatchKeys(keys);
        this.dispatchCount++;
      }
      return keys.length > 0;
    }
    this.observer?.dispatch('dispatch', [key, value] as any);
    if (this.dispatchPair(key, value!)) {
      this.dispatchKeys([key]);
      this.dispatchCount++;
      return true;
    }
    return false;
  }

  private dispatchPair<K extends keyof T>(key: K, value: MetaState.Action<T[K]>) {
    const newValue = typeof value === 'function' ? (value as any)(this.storage[key]) : value;
    if (this.storage[key] !== newValue) {
      this.storage[key] = newValue;
      if (this.subscribers[key]) {
        for (const subscriber of this.subscribers[key].slice()) {
          try {
            if (subscriber(newValue)) break;
          } catch (error) {
            console.error(error);
          }
        }
      }
      return true;
    }
  }

  private dispatchKeys(keys: (keyof T)[]) {
    if (this.subscriberList.length > 0) {
      for (const subscriber of this.subscriberList.slice()) {
        try {
          if (subscriber(keys)) break;
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
}

export namespace MetaState {
  type KeyVal<T> = {
    [K in keyof T]: [key: K, value: T[K]];
  }[keyof T];

  export type Observer<T extends Record<string, unknown>> = {
    subscribe: KeyVal<{ [K in keyof T]: (value: T[K]) => void }> | MetaState.Subscriber<T>;
    unsubscribe: KeyVal<{ [K in keyof T]: (value: T[K]) => void }> | MetaState.Subscriber<T>;
    dispatch: Partial<{ [K in keyof T]: Action<T[K]> }> | KeyVal<{ [K in keyof T]: Action<T[K]> }>;
  };

  export type Action<V> = V | ((prevState: V) => V);

  export type Subscriber<T extends Record<string, unknown>> = (keys: (keyof T)[]) => void | boolean;

  export type Unwrap<T extends MetaState<any>> = T extends MetaState<infer U> ? U : never;
}
