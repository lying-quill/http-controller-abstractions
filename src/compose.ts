/** biome-ignore-all lint/suspicious/noExplicitAny: ><> */
/** biome-ignore-all lint/complexity/noBannedTypes: ><> */

import { isTransformRecord, type Middleware } from "./middleware";

export type Composed<TIn, TOut, TBindings = {}> = (
	input: TIn,
	bindings: TBindings,
) => Promise<TOut>;

export class Compose<
	TNextIn,
	TBindings extends {},
	TCtx extends {},
	TInitialInput,
	TCurrentOut,
> {
	private constructor(
		protected readonly middlewares: Middleware<any, TCtx, TBindings>[] = [],
	) {}

	public static new<T, U extends {}>() {
		return new Compose<T, U, {}, T, undefined>();
	}

	public with<T, U extends {}>(
		m: Middleware<TNextIn, TCtx, TBindings, U, T>,
	): Compose<T, TBindings, U & Omit<TCtx, keyof U>, TInitialInput, T> {
		return new Compose([...(this.middlewares as any), m]);
	}

	public end(): Composed<TInitialInput, TCurrentOut, TBindings> {
		if (!this.middlewares.length)
			throw new Error("Cannot compose an empty chain of middlewares");

		return async (input, bindings) => {
			let inp: any = input;
			let ctx: any = {};

			for (const m of this.middlewares) {
				// TODO: implement error handling
				// try {
				const next = await m(inp, ctx, bindings as any);
				if (isTransformRecord(next)) {
					inp = next.out;
					ctx = { ...ctx, ...next.ctx };
				} else {
					inp = next;
				}
				// } catch (e) {}
			}

			return inp;
		};
	}
}
