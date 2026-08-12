import type { BaseMiddleware, HttpStatus, StatusMap, ValuesOf } from "./common";
import type { Status } from "./status";

export type Controller<
	TIn,
	TMap extends StatusMap,
	TCtx extends {} = {},
	TBindings extends {} = {},
> = BaseMiddleware<
	TIn,
	TCtx,
	TBindings,
	ValuesOf<{
		[S in keyof TMap]: S extends HttpStatus ? Status<S, TMap[S]> : never;
	}>
>;
