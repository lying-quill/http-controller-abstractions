/** biome-ignore-all lint/complexity/noBannedTypes: ><> */
import type { MaybePromise } from "./common";

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
