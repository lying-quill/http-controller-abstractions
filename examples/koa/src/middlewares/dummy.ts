import type { Middleware } from "http-controller-abstractions";
import type Koa from "koa";
import type { DummyContext, ServiceBindings } from "~/bindings";

export const dummyMiddleware: Middleware<
	Koa.Context,
	ServiceBindings,
	// biome-ignore lint/suspicious/noExplicitAny: ><>
	any,
	DummyContext
> = (input, _ctx, _bindings) => {
	return {
		input,
		context: {
			meow: true,
		},
	};
};
