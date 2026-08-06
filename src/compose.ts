/** biome-ignore-all lint/suspicious/noExplicitAny: ><> */
/** biome-ignore-all lint/complexity/noBannedTypes: ><> */
import type { ResponseMap } from "./common";
import type { Controller } from "./controller";
import type { Middleware } from "./middleware";
import { redirect, type Status, status } from "./status";

export type Composed<TInput, TBindings> = (
	input: TInput,
	bindings: TBindings,
) => Promise<Status<any, any>>;

export class Compose<TIn, TBindings, TInitialInput = TIn, TCtx = {}> {
	private constructor(
		protected readonly middlewares: Middleware<any, any>[] = [],
	) {}

	public static new<TIn, TBindings>() {
		return new Compose<TIn, TBindings>();
	}

	/** adds a middleware to the chain */
	public before<TOut = TIn, TCtxOut = TCtx>(
		m: Middleware<TIn, TBindings, TCtx, TCtxOut, TOut>,
	): Compose<TOut, TBindings, TInitialInput, TCtxOut> {
		return new Compose([...(this.middlewares as any), m]);
	}

	/**
	 * returns a function that calls all the registered middlewares in order
	 * until calling the actual controller.
	 */
	public end<TMap extends ResponseMap>(
		c: Controller<TIn, TMap, TCtx, TBindings>,
	): Composed<TInitialInput, TBindings> {
		const middlewaresCopy = [...this.middlewares];

		return async (input, bindings) => {
			let currentInput: any = input;
			let currentContext: any = {};

			for (const middleware of middlewaresCopy) {
				const result = await middleware(
					currentInput,
					currentContext,
					bindings as any,
				);

				currentInput = result.input;
				currentContext = result.context;
			}

			return await c(currentInput as TIn, currentContext as TCtx, {
				...(bindings as any),
				// bind these to the global ones
				status,
				redirect,
			});
		};
	}
}
