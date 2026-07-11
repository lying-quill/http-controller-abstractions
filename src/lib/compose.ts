/** biome-ignore-all lint/complexity/noBannedTypes: ><> */
/** biome-ignore-all lint/suspicious/noExplicitAny: ><> */
import {
	type Controller,
	type Middleware,
	type ResponseMap,
	redirect,
	type Status,
	status,
} from "./controller";

export type Composed<T, U> = (
	input: T,
	bindings?: U,
) => Promise<Status<any, any>>;

export class Compose<TIn, TBindings, TInitialInput = TIn, TCtx = {}> {
	constructor(
		protected readonly bindings?: TBindings,
		protected readonly middlewares: Middleware<any, any>[] = [],
	) {}

	modify<TOut = TIn, TCtxOut = TCtx>(
		m: Middleware<TIn, TBindings, TCtx, TCtxOut, TOut>,
	): Compose<TOut, TBindings, TInitialInput, TCtxOut> {
		return new Compose(this.bindings, [...(this.middlewares as any), m]);
	}

	handle<TMap extends ResponseMap>(
		c: Controller<TIn, TMap, TCtx, TBindings>,
	): Composed<TInitialInput, TBindings> {
		return async (input, bindings) => {
			const binds = bindings ?? this.bindings;

			if (binds === undefined) {
				throw new Error("No bindings applied for handler");
			}

			let currentInput: any = input;
			let currentContext: any = {};

			for (const middleware of this.middlewares) {
				const result = await middleware(
					currentInput,
					currentContext,
					binds as any,
				);

				currentInput = result.input;
				currentContext = result.context;
			}

			return await c(currentInput as TIn, currentContext as TCtx, {
				...(binds as any),
				// bind these to the global function
				status,
				redirect,
			});
		};
	}

	// static createWithBindings<In, Bindings>(bindings?: Bindings) {
	// 	return new Compose<In, Bindings>(bindings);
	// }

	// static createWithoutBindings<In>() {
	// 	return new Compose<In, {}>({});
	// }

	// static create<In>(): <Bindings>(b: Bindings) => Compose<In, Bindings> {
	// 	return <Bindings>(bindings: Bindings) =>
	// 		Compose.createWithBindings<In, Bindings>(bindings);
	// }
}
