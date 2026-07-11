export const classes = (...args: Array<undefined | null | number | boolean | string | { loading: boolean }>) => {
  const classNames = [] as string[];
  for (const arg of args) {
    if (typeof arg === 'string') {
      classNames.push(arg);
    } else if (arg && typeof arg === 'object') {
      if ('loading' in arg) {
        classNames.push(arg.loading ? 'opacity-50' : 'transition-opacity');
      }
    }
  }
  return classNames.join(' ');
};
