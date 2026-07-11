'use client';
/* eslint-disable react-hooks/rules-of-hooks */
import React, { createContext, use, useEffect, useMemo } from 'react';
import { MetaState } from './MetaState';

const getContext = <T extends Record<string, Record<string, unknown>>>(values: T) => {
  const context = {} as { [K in keyof T]: MetaState<T[K]> };
  for (const key in values) {
    context[key] = new MetaState(values[key]);
  }
  return context;
};

export const createMultiContext = <T extends Record<string, Record<string, unknown>>>(values: T) => {
  const MetaContext = createContext(getContext(values));

  const MetaContextProvider = ({ children, ...values }: { children: React.ReactNode } & Partial<T>) => {
    const newContext = useMemo(() => ({ ...useMetaContext(), ...getContext(values as unknown as T) }), []);
    useEffect(() => {
      for (const key in values) {
        newContext[key].dispatch(values[key] as any);
      }
    }, [values]);
    return <MetaContext.Provider value={newContext}>{children}</MetaContext.Provider>;
  };

  const useMetaContext = () => {
    return use(MetaContext);
  };

  return { useMetaContext, MetaContextProvider };
};

export const createValueContext = <T extends Record<string, unknown>>(value?: T) => {
  const MetaContext = createContext(new MetaState(value));

  const MetaContextProvider = ({ children, value }: { children: React.ReactNode; value: T }) => {
    const state = useMemo(() => new MetaState(value), []);
    useEffect(() => {
      state.dispatch(value);
    }, [value]);
    return <MetaContext.Provider value={state}>{children}</MetaContext.Provider>;
  };

  const useMetaContext = () => {
    return use(MetaContext);
  };

  return { useMetaContext, MetaContextProvider };
};
