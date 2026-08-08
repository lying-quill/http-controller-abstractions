import type { StandardSchemaV1 } from "@standard-schema/spec";
import { type Middleware, Status } from "http-controller-abstractions";
import type Koa from "koa";

// TODO: this should become part of the library?

export function createBodyMiddleware<TIn, TOut, TBindings, TCtxIn>(
	schema: StandardSchemaV1<TIn, TOut>,
): Middleware<
	Koa.Context,
	TBindings,
	TCtxIn,
	/* input context is not modified */ TCtxIn,
	TOut,
	Status<422, { error: "ValidationError" }>
> {
	return async (input, context) => {
		const validated = await schema["~standard"].validate(
			["POST", "PUT", "PATCH"].includes(input.method)
				? (input.request.body ?? {})
				: input.request.query,
		);

		if ("issues" in validated && validated.issues) {
			return {
				context,
				error: new Status(422, { error: "ValidationError" }, {}),
			};
		}

		return {
			context,
			input: validated.value,
		};
	};
}
