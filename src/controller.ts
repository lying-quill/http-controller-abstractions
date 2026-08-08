/** biome-ignore-all lint/complexity/noBannedTypes: ><> */
import type { HttpStatus, MaybePromise, ResponseMap, ValuesOf } from "./common";
import type { Status } from "./status";

/** an abstract controller definition focused on ??? */
export type Controller<TInput, TMap extends ResponseMap, TCtx, TBindings> = (
	input: Readonly<TInput>,
	context: Readonly<TCtx>,
	bindings: TBindings,
) => MaybePromise<
	ValuesOf<{
		[S in keyof TMap]: S extends HttpStatus ? Status<S, TMap[S]> : never;
	}>
>;
