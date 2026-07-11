import 'requestidlecallback-polyfill';

window._hm = window._hm || [];

window.addEventListener('error', event => {
  if (process.env.NODE_ENV === 'development') {
    console.log('event', 'exception', {
      description: event.error?.message || event.message,
      page: window.location.pathname,
      file: event.filename,
      line: event.lineno,
      colo: event.colno,
      fatal: false,
    });
  }
});

window.addEventListener('unhandledrejection', event => {
  if (process.env.NODE_ENV === 'development') {
    console.log('event', 'exception', {
      description: event.reason?.message || 'unhandledrejection',
      reason: event.reason?.toString?.(),
      page: window.location.pathname,
      fatal: false,
    });
  }
});

export function onRouterTransitionStart(url: string, navigationType: 'push' | 'replace' | 'traverse') {
  if (process.env.NODE_ENV === 'development') {
    console.log('event', 'page_view', { url, navigationType });
  }
}
