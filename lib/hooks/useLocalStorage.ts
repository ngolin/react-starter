import { MetaState } from '@/lib/statex';
import { useEffect } from 'react';

const defaultValues = {
  headerSearchHistory: {} as Record<string, [1 | -1 | 0, number]>,
  userCollection: [] as Array<{
    id: string;
    name: string;
    exchange: string;
    groups: string[];
    special?: boolean;
  }>,
  userGroupActive: '',
  userGroups: [] as Array<{ id: string; name: string; hidden?: boolean }>,
  refreshDismissed: false,
  ind: true,
  val: true,
  vol: true,
};

const channel = new MetaState(defaultValues);

export type useLocalStorage = typeof defaultValues;

export const useLocalStorage = <K extends keyof typeof defaultValues>(key: K) => {
  const value = channel.use(key);

  useEffect(() => {
    {
      let param = localStorage.getItem(`uls.${key}`);
      if (typeof param === 'string' && channel.get(key) === defaultValues[key]) {
        try {
          const value = JSON.parse(param);
          channel.dispatch(key, upgrade[key] ? upgrade[key](value) : value);
        } catch {
          localStorage.removeItem(`uls.${key}`);
        }
        param = null;
      }
    }
  }, [key]);

  return [value, channel.useDispatch(key)] as const;
};

let id = 0;
channel.subscribe(keys => {
  cancelIdleCallback(id);
  id = requestIdleCallback(() => {
    for (const key of keys) {
      const value = channel.get(key);
      {
        localStorage.setItem(`uls.${key}`, JSON.stringify(value));
      }
    }
  });
});

const upgrade: { [K in keyof useLocalStorage]?: (value: useLocalStorage[K]) => useLocalStorage[K] } = {};
