import type { StandardSchemaV1 } from "@standard-schema/spec";
import {
	createTransformRecord,
	type Middleware,
} from "http-controller-abstractions";
import type Koa from "koa";

export class ValidationError extends Error {
	public readonly name: string = "ValidationError";

	constructor(issues: string[], schema: StandardSchemaV1) {
		super();
		this.message = issues.join("; ");
		this.cause = schema;
	}
}

export function createBodyMiddleware<
	TIn,
	TOut,
	TBindings extends {},
	TCtxIn extends {},
>(
	schema: StandardSchemaV1<TIn, TOut>,
): Middleware<Koa.Context, TCtxIn, TBindings, {}, TOut> {
	return async (input) => {
		const validated = await schema["~standard"].validate(
			["POST", "PUT", "PATCH"].includes(input.method)
				? (input.request.body ?? {})
				: input.request.query,
		);

		if ("issues" in validated && validated.issues) {
			throw new ValidationError(
				validated.issues.map((i) => i.message),
				schema,
			);
		}

		return createTransformRecord(validated.value, {});
	};
}
