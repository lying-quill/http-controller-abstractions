/** biome-ignore-all lint/complexity/noBannedTypes: ><> */
import type { MaybePromise } from "./common";
import type { Status } from "./status";

export type Middleware<
	TIn,
	TBindings = {},
	TCtxIn = {},
	TCtxOut = TCtxIn,
	TOut = TIn,
	// biome-ignore lint/suspicious/noExplicitAny: ><>
	TError extends Status<any, any> = Status<any, any>,
> = (
	input: Readonly<TIn>,
	context: Readonly<TCtxIn>,
	bindings: Readonly<TBindings>,
) => MaybePromise<
	(
		| {
				error: TError;
				input?: undefined | null;
		  }
		| {
				error?: undefined | null;
				input: TOut;
		  }
	) & {
		context: TCtxOut;
	}
>;
