export function zip<T, V>(list1: readonly T[], list2: readonly V[]) {
  const length = Math.min(list1.length, list2.length);
  const result: Array<[T, V]> = [];
  for (let i = 0; i < length; i++) {
    result.push([list1[i], list2[i]]);
  }
  return result;
}
