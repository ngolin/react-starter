'use client';

import { neutralTheme } from '@astryxdesign/theme-neutral/built';
import { LinkProvider } from '@astryxdesign/core/Link';
import { Theme } from '@astryxdesign/core/theme';
import { LazyLink } from './LazyLink';

export function AppProvider({ children }: Pick<LayoutProps<'/'>, 'children'>) {
  return (
    <Theme theme={neutralTheme}>
      <LinkProvider component={LazyLink}>{children}</LinkProvider>
    </Theme>
  );
}
