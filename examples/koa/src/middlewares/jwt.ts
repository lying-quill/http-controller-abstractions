import type { Middleware } from "http-controller-abstractions";
import type Koa from "koa";
import type { AuthContext, ServiceBindings } from "~/bindings";

export const jwtMiddleware: Middleware<
	Koa.Context,
	ServiceBindings,
	unknown,
	AuthContext
> = (input, context) => {
	return {
		input,
		context: {
			...context,
			user: null,
		},
	};
};
