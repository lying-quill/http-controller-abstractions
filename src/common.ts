export type ValuesOf<T> = T[keyof T];

export type MaybePromise<T> = T | Promise<T>;

export type HttpStatus = number; // TODO: http codes

export type HttpRedirectStatus = 301 | 302 | 303 | 307 | 308;

export type ResponseMap = Record<HttpStatus, unknown>;
