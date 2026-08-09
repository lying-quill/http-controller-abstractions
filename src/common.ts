export type ValuesOf<T> = T[keyof T];

export type MaybePromise<T> = T | Promise<T>;

export type HttpStatus = number; // TODO: http codes

export type StatusMap = Record<HttpStatus, unknown>;
