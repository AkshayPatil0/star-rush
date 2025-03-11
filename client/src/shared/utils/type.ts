export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type WithOnlyRequired<T, K extends keyof T> = Partial<T> & {
  [P in K]-?: T[P];
};
