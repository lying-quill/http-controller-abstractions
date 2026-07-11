import * as v from "valibot";
import type * as App from "../../app/bindings";
import type { Controller } from "../../lib/controller";

type ListUsersResponses = {
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
	ListUsersResponses,
	App.AuthMiddlewareContext,
	App.ServiceBindings
> = (input, ctx, { status, redirect }) => {
	console.log(input);

	// if (Math.random()) {
	// 	return redirect(302, "ggogel.com");
	// }

	return status(200, {
		users: [String(ctx.user)],
	});
};
