import { Suspense, ComponentType, ReactNode } from 'react';

export type WithSuspenseProps<P extends object> = P & {
  fallback?: ReactNode;
};

export const withSuspense = <P extends object>(WrappedComponent: ComponentType<P>, defaultFallback?: ReactNode) => {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Anonymous';

  function WithSuspenseWrapper(props: WithSuspenseProps<P>) {
    const { fallback, ...rest } = props;

    return (
      <Suspense fallback={fallback ?? defaultFallback}>
        <WrappedComponent {...(rest as P)} />
      </Suspense>
    );
  }

  WithSuspenseWrapper.displayName = `withSuspense(${displayName})`;

  return WithSuspenseWrapper;
};
