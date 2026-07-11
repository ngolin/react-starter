'use client';

import { useNotSSR } from './useNotSSR';

export interface NoSSR {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const NoSSR = ({ children, fallback }: NoSSR) => (useNotSSR() ? children : fallback);
