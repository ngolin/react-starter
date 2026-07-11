export const removeMut = <T>(array: T[], item: T) => {
  const index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
  return index;
};

export const pushRemoveMut = <T>(array: T[], item: T) => {
  array.push(item);
  return () => {
    removeMut(array, item);
  };
};

export const getRemovable = () => {
  const removable: Array<() => void> = [];
  return {
    push: removable.push.bind(removable),
    remove() {
      let remove: (() => void) | undefined;
      while ((remove = removable.pop())) {
        remove();
      }
    },
  };
};
