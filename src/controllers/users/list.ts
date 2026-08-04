import * as v from "valibot";
import type * as App from "../../app/bindings";
import type { Controller } from "../../lib/controller";

type Responses = {
	200: { users: string[] };
	204: { error: "NoUsers" };
	403: { error: "Unauthorized" };
	302: undefined;
};

export const inputSchema = v.optional(
	v.object({
		page: v.number(),
	}),
);

export const listUsers: Controller<
	v.InferOutput<typeof inputSchema>,
	Responses,
	App.AuthMiddlewareContext,
	App.ServiceBindings
> = (input, ctx, { status }) => {
	console.log(input);

	return status(200, {
		users: [String(ctx.user)],
	});
};
