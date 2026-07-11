import { useState } from 'react';

export const useServerSearch = <T>(
  globalParams: Record<string, ParamValue>,
  getValue: (params: Record<string, ParamValue>) => T,
) => {
  const [newParams, setNewParams] = useState(globalParams);

  const callback = (params: Record<string, string | undefined>) => {
    setNewParams(oldParams => ({ ...oldParams, ...params }));
    Object.assign(globalParams, params);
    requestIdleCallback(() => {
      const query = new URLSearchParams(window.location.search);
      for (const [key, val] of Object.entries(params)) {
        if (typeof val === 'string') {
          query.set(key, val);
        } else {
          query.delete(key);
        }
      }
      window.history.replaceState(null, '', `?${query}`);
    });
  };
  return [getValue(newParams), callback] as const;
};
