/** biome-ignore-all lint/suspicious/noExplicitAny: ><> */
/** biome-ignore-all lint/complexity/noBannedTypes: ><> */
import type { ResponseMap } from "./common";
import type { Controller } from "./controller";
import type { Middleware } from "./middleware";
import type { Status } from "./status";

export type Composed<TInput, TBindings> = (
	input: TInput,
	bindings: TBindings,
) => Promise<Status<any, any>>;

export class Compose<TIn, TBindings, TInitialInput = TIn, TCtx = {}> {
	private constructor(
		protected readonly middlewares: Middleware<TIn, TBindings>[] = [],
	) {}

	public static new<TIn, TBindings>() {
		return new Compose<TIn, TBindings>();
	}

	/** adds a middleware to the chain */
	public before<TOut = TIn, TCtxOut = {}>(
		m: Middleware<TIn, TBindings, TCtx, TCtxOut, TOut>,
	): Compose<
		TOut,
		TBindings,
		TInitialInput,
		TCtxOut & Omit<TCtx, keyof TCtxOut>
	> {
		return new Compose([...(this.middlewares as any), m]);
	}

	/**
	 * returns a function that calls all the registered middlewares in order
	 * until calling the actual controller.
	 */
	public end<TMap extends ResponseMap>(
		c: Controller<TIn, TMap, TCtx, TBindings>,
	): Composed<TInitialInput, TBindings> {
		return async (input, bindings) => {
			let inp: any = input;
			let ctx: any = {};

			for (const m of this.middlewares) {
				const result = await m(inp, ctx, bindings);

				if (result.error) {
					// return early if the middleware needs to
					return result.error;
				}

				inp = result.input;

				// merge the contexts
				ctx = {
					...ctx,
					...result.context,
				};
			}

			return await c(inp as TIn, ctx as TCtx, bindings);
		};
	}
}
