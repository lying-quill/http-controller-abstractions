export type ValuesOf<T> = T[keyof T];

export type MaybePromise<T> = T | Promise<T>;

export type HttpStatus = number;

export type StatusMap = Record<HttpStatus, any>;

export type BaseMiddleware<TIn, TCtx, TBindings, TRet> = (
	input: Readonly<TIn>,
	context: Readonly<TCtx>,
	bindings: Readonly<TBindings>,
) => MaybePromise<TRet>;
