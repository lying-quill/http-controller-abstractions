import type Koa from "koa";
import type * as App from "../app/bindings";
import type { Middleware } from "../lib/controller";

export const koaJwtMiddleware: Middleware<
	Koa.Context,
	App.ServiceBindings,
	any,
	App.AuthMiddlewareContext
> = (input, context) => {
	return {
		input,
		context: {
			...context,
			user: {
				token: input.get("X-API-Token"),
			},
		},
	};
};
