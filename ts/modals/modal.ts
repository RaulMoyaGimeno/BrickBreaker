export interface Modal<T> {
  show(...args: any): Promise<T>;
}
