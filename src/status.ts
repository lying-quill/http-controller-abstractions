import type { HttpStatus, ResponseMap } from "./common";

export interface StatusOptions {
	headers?: Record<string, string>;
	// FIXME: probably pick a better type
	// cookies?: Record<string, string>;
	redirect?: string;
}

export class Status<
	TStatus extends HttpStatus,
	TBody = unknown,
	TOptions extends StatusOptions = StatusOptions,
> {
	constructor(
		public readonly status: TStatus,
		public readonly body: TBody,
		public readonly options: TOptions,
	) {}
}

export function bind<const TMap extends ResponseMap>() {
	return {
		status,
	} as {
		status<TStatus extends keyof TMap>(
			status: TStatus,
			body: TMap[TStatus],
		): TStatus extends HttpStatus // 'keyof TMap' also includes 'symbol | string'
			? Status<TStatus, TMap[TStatus]>
			: never;
	};
}

export function status<
	const TMap extends ResponseMap,
	const TStatus extends keyof TMap & HttpStatus,
>(status: TStatus, body: TMap[TStatus]): Status<TStatus, TMap[TStatus]> {
	return new Status(status, body, {});
}
