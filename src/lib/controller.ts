/** biome-ignore-all lint/complexity/noBannedTypes: ><> */
/** biome-ignore-all lint/suspicious/noExplicitAny: ><> */
/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: ><> */
/** biome-ignore-all lint/correctness/noUnusedVariables: ><> */

type ValuesOf<T> = T[keyof T];

type HttpStatus = number; // TODO: http codes

type HttpRedirectStatus = 301 | 302 | 303 | 307 | 308;

export type MaybePromise<T> = T | Promise<T>;

export type ResponseMap = Record<HttpStatus, unknown>;

export type Middleware<
	TIn,
	TBindings = {},
	TCtxIn = {},
	TCtxOut = TCtxIn,
	TOut = TIn,
> = (
	input: Readonly<TIn>,
	context: Readonly<TCtxIn>,
	bindings: Readonly<TBindings>,
) => MaybePromise<{
	input: TOut;
	context: TCtxOut;
}>;

type ControllerBindings<T, TMap extends ResponseMap> = Readonly<
	T & {
		status<TStatus extends keyof TMap>(
			status: TStatus,
			body: TMap[TStatus],
		): TStatus extends HttpStatus // 'keyof TMap' also includes 'symbol | string'
			? Status<TStatus, TMap[TStatus]>
			: never;

		redirect<const TStatus extends HttpRedirectStatus>(
			status: TStatus,
			dest: string,
		): RedirectStatus<TStatus>;
	}
>;

/** an abstract controller definition focused on ??? */
export type Controller<TInput, TMap extends ResponseMap, TCtx, TBindings> = (
	input: Readonly<TInput>,
	context: Readonly<TCtx>,
	bindings: ControllerBindings<TBindings, TMap>,
) => MaybePromise<
	ValuesOf<{
		[S in keyof TMap]: S extends HttpStatus ? Status<S, TMap[S]> : never;
	}>
>;

// TODO: rename?
export class Status<TStatus extends HttpStatus, TBody = unknown> {
	constructor(
		public readonly status: TStatus,
		public readonly body: TBody,
		public readonly options: {
			headers?: Record<string, string>;
			// FIXME: probably pick a better type
			// cookies?: Record<string, string>;
			redirect?: string;
		},
	) { }
}

export type RedirectStatus<TStatus extends HttpRedirectStatus> = Status<
	TStatus,
	undefined
>;

export function status<
	const TMap extends ResponseMap,
	const TStatus extends keyof TMap & HttpStatus,
>(status: TStatus, body: TMap[TStatus]): Status<TStatus, TMap[TStatus]> {
	return new Status(status, body, {});
}

export function redirect<const TStatus extends HttpRedirectStatus>(
	status: TStatus,
	dest: string,
): RedirectStatus<TStatus> {
	return new Status(status, undefined, {
		redirect: dest,
	});
}
