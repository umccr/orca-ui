export function areArraysEqual(arr1: string[], arr2: string[]) {
  return arr1.sort().join(',') === arr2.sort().join(',');
}
