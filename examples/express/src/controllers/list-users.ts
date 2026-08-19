import { bindResponse, type Controller } from "http-controller-abstractions";
import * as v from "valibot";
import type { AuthContext, ServiceBindings } from "~/bindings";

type StatusMap = {
	200: { users: string[] };
	204: undefined;
};

const response = bindResponse<StatusMap>();

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
	// pick the services you actually use here so testing is easier
	Pick<ServiceBindings, "db">
> = (input, ctx, svc) => {
	console.log(input, ctx, svc);

	if (Math.random() > 0.5) {
		return response(204, undefined);
	}

	return response(200, {
		users: [String(ctx.user)],
	});
};

export { inputSchema };

export default controller;
