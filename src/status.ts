import type { HttpRedirectStatus, HttpStatus, ResponseMap } from "./common";

export interface StatusOptions {
	headers?: Record<string, string>;
	// FIXME: probably pick a better type
	// cookies?: Record<string, string>;
	redirect?: string;
}

// TODO: perhaps the name does not make sense?
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

export type RedirectStatus<
	TStatus extends HttpRedirectStatus,
	TOptions extends StatusOptions = StatusOptions,
> = Status<TStatus, undefined, TOptions & Required<Pick<TOptions, "redirect">>>;

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
