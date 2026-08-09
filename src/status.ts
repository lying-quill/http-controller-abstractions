import type { HttpStatus, StatusMap } from "./common";

export interface StatusOptions {
	headers?: Record<string, string>;
	/**
	 * passing null as value deletes the cookie
	 */
	cookies?: Record<
		string,
		null | {
			/** cookie's value */
			value: string;
			/**
			 * a number representing the milliseconds from Date.now() for expiry
			 */
			maxAge?: number | undefined;
			/**
			 * a Date object indicating the cookie's expiration
			 * date (expires at the end of session by default).
			 */
			expires?: Date | undefined;
			/**
			 * a string indicating the path of the cookie (/ by default).
			 */
			path?: string | undefined;
			/**
			 * a string indicating the domain of the cookie (no default).
			 */
			domain?: string | undefined;
			/**
			 * a boolean indicating whether the cookie is only to be sent
			 * over HTTPS (false by default for HTTP, true by default for HTTPS).
			 */
			secure?: boolean | undefined;
			/**
			 * "secureProxy" option is deprecated; use "secure" option, provide "secure" to constructor if needed
			 */
			secureProxy?: boolean | undefined;
			/**
			 * a boolean indicating whether the cookie is only to be sent over HTTP(S),
			 * and not made available to client JavaScript (true by default).
			 */
			httpOnly?: boolean | undefined;
			/**
			 * a boolean or string indicating whether the cookie is a "same site" cookie (false by default).
			 * This can be set to 'strict', 'lax', or true (which maps to 'strict').
			 */
			sameSite?: "strict" | "lax" | "none" | boolean | undefined;
			/**
			 * a boolean indicating whether the cookie is to be signed (false by default).
			 * If this is true, another cookie of the same name with the .sig suffix
			 * appended will also be sent, with a 27-byte url-safe base64 SHA1 value
			 * representing the hash of cookie-name=cookie-value against the first Keygrip key.
			 * This signature key is used to detect tampering the next time a cookie is received.
			 */
			signed?: boolean | undefined;
			/**
			 * a boolean indicating whether to overwrite previously set
			 * cookies of the same name (false by default). If this is true,
			 * all cookies set during the same request with the same
			 * name (regardless of path or domain) are filtered out of
			 * the Set-Cookie header when setting this cookie.
			 */
			overwrite?: boolean | undefined;
			/**
			 * a string indicating the cookie priority.
			 * This can be set to 'low', 'medium', or 'high'.
			 */
			priority?: "low" | "medium" | "high" | undefined;
			/**
			 * a boolean indicating whether to partition the cookie in Chrome
			 * for the CHIPS Update (false by default). If this is true,
			 * Cookies from embedded sites will be partitioned
			 * and only readable from the same top level site from which it was created.
			 */
			partitioned?: boolean | undefined;
		}
	>;
	redirect?: string;
}

export class Status<
	TStatus extends HttpStatus = HttpStatus,
	TBody = unknown,
	TOptions extends StatusOptions = StatusOptions,
> {
	constructor(
		public readonly status: TStatus,
		public readonly body: TBody,
		public readonly options: TOptions,
	) {}
}

export function bindStatus<const TMap extends StatusMap>() {
	return status as <TStatus extends keyof TMap>(
		status: TStatus,
		body: TMap[TStatus],
		options?: StatusOptions,
	) => TStatus extends HttpStatus // 'keyof TMap' also includes 'symbol | string'
		? Status<TStatus, TMap[TStatus]>
		: never;
}

export function status<
	const TMap extends StatusMap,
	const TStatus extends keyof TMap & HttpStatus,
>(
	status: TStatus,
	body: TMap[TStatus],
	options?: StatusOptions,
): Status<TStatus, TMap[TStatus]> {
	return new Status(status, body, options ?? {});
}
