import { bind, type Controller } from "http-controller-abstractions";
import * as v from "valibot";
import type { AuthContext, ServiceBindings } from "~/bindings";

type StatusMap = {
	200: { users: string[] };
	204: { error: "NoUsers" };
};

const { status } = bind<StatusMap>();

const inputSchema = v.object({
	page: v.optional(
		v.union([
			v.number(),
			v.pipe(
				// allows parsing GET queries
				v.string(),
				v.regex(v.DIGITS_REGEX),
				v.transform((i) => Number.parseInt(i, 10)),
			),
		]),
	),
});

const controller: Controller<
	v.InferOutput<typeof inputSchema>,
	StatusMap,
	AuthContext,
	ServiceBindings
> = (input, ctx, _svc) => {
	console.log(input, ctx);

	return status(200, {
		users: [String(ctx.user)],
	});
};

export { inputSchema };

export default controller;
