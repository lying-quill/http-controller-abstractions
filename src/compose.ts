import type { MaybePromise } from "./common";
import { isTransformRecord, type Middleware } from "./middleware";

export type Composed<TIn, TOut, TBindings = {}> = (
	input: TIn,
	bindings: TBindings,
) => Promise<TOut>;

export type ErrorHandler<TFallback> = (
	e: any,
) => undefined | MaybePromise<TFallback>;

export class Compose<
	TNextIn,
	TBindings extends {},
	TCtx extends {},
	TInitialInput,
	TCurrentOut,
	TErrorRet,
> {
	private constructor(
		protected readonly middlewares: Middleware<any, TCtx, TBindings>[] = [],
		protected readonly errorHandler?: ErrorHandler<any>,
	) {}

	public static new<T, U extends {}>() {
		return new Compose<T, U, {}, T, undefined, never>();
	}

	public with<T, U extends {}>(
		m: Middleware<TNextIn, TCtx, TBindings, U, T>,
	): Compose<
		T,
		TBindings,
		U & Omit<TCtx, keyof U>,
		TInitialInput,
		T,
		TErrorRet
	> {
		return new Compose(
			[...(this.middlewares as any), m],
			this.errorHandler,
		);
	}

	public catch<T>(
		f: ErrorHandler<T>,
	): Compose<TNextIn, TBindings, TCtx, TInitialInput, TCurrentOut, T> {
		return new Compose([...this.middlewares], f);
	}

	public end(): Composed<TInitialInput, TCurrentOut | TErrorRet, TBindings> {
		if (!this.middlewares.length)
			throw new Error("Cannot compose an empty chain of middlewares");

		return async (input, bindings) => {
			let inp: any = input;
			let ctx: any = {};

			for (const m of this.middlewares) {
				try {
					const next = await m(inp, ctx, bindings as any);
					if (isTransformRecord(next)) {
						inp = next.out;
						ctx = { ...ctx, ...next.ctx };
					} else {
						inp = next;
					}
				} catch (e) {
					if (this.errorHandler)
						// ><>
						return await this.errorHandler(e);

					throw e;
				}
			}

			return inp;
		};
	}
}
