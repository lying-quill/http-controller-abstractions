import type { Controller } from "http-controller-abstractions";
import * as v from "valibot";
import type { AuthContext, ServiceBindings } from "~/bindings";

type StatusMap = {
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

const controller: Controller<
	v.InferOutput<typeof inputSchema>,
	StatusMap,
	AuthContext,
	ServiceBindings
> = (input, ctx, { status }) => {
	console.log(input);

	return status(200, {
		users: [String(ctx.user)],
	});
};

// controller(
// 	{ page: 0 },
// 	{ user: null },
// 	{
// 		db: null,
//		FIXME: this sucks??????
// 		redirect: redirect as any,
// 		status: status as any,
// 	},
// );

export default controller;
