'use client';

import Link, { LinkProps } from 'next/link';
import { useState } from 'react';

export const LazyLink = (
  props: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps<any>> & LinkProps<any>,
) => {
  const [active, setActive] = useState(false);
  return <Link prefetch={active ? null : false} onMouseEnter={() => setActive(true)} draggable={false} {...props} />;
};
