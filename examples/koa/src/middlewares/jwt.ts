import type { Middleware } from "http-controller-abstractions";
import type Koa from "koa";
import type { AuthContext, DummyContext, ServiceBindings } from "~/bindings";

export const jwtMiddleware: Middleware<
	Koa.Context,
	ServiceBindings,
	// this middleware depends on dummyMiddleware for some reason
	DummyContext,
	AuthContext
> = (input, _ctx, _bindings) => {
	return {
		input,
		context: {
			user: null,
		},
	};
};
