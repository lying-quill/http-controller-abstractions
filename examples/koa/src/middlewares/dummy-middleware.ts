import type { Middleware } from "http-controller-abstractions";
import type Koa from "koa";
import type { DummyContext, ServiceBindings } from "~/bindings";

export const dummyMiddleware =
	<T>(): Middleware<
		Koa.Context,
		ServiceBindings,
		T,
		Omit<T, keyof DummyContext> & DummyContext
	> =>
	(input, context) => {
		return {
			input,
			context: {
				...context,
				meow: true,
			},
		};
	};
