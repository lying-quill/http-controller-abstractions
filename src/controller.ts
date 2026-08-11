import type { HttpStatus, StatusMap, ValuesOf } from "./common";
import type { Middleware } from "./middleware";
import type { Status } from "./status";

export type Controller<
	TIn,
	TMap extends StatusMap,
	TCtx extends {} = {},
	TBindings extends {} = {},
> = Middleware<
	TIn,
	TCtx,
	TBindings,
	// controller should not modify the context
	TCtx,
	ValuesOf<{
		[S in keyof TMap]: S extends HttpStatus ? Status<S, TMap[S]> : never;
	}>
>;
