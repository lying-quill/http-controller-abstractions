/** biome-ignore-all lint/complexity/noBannedTypes: ><> */
import type {
	HttpRedirectStatus,
	HttpStatus,
	MaybePromise,
	ResponseMap,
	ValuesOf,
} from "./common";
import type { RedirectStatus, Status } from "./status";

type BindingsWithUtils<T, TMap extends ResponseMap> = Readonly<
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
	bindings: BindingsWithUtils<TBindings, TMap>,
) => MaybePromise<
	ValuesOf<{
		[S in keyof TMap]: S extends HttpStatus ? Status<S, TMap[S]> : never;
	}>
>;
