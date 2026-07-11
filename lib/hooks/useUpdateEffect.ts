import { useEffect, useRef } from 'react';

export const useUpdateEffect = (effect: () => void | (() => void), deps?: readonly unknown[]) => {
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) {
      return effect();
    }
    ref.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
