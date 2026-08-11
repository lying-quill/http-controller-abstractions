import type { StandardSchemaV1 } from "@standard-schema/spec";
import type * as Express from "express";
import {
	createTransformRecord,
	type Middleware,
} from "http-controller-abstractions";

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
): Middleware<Express.Request, TCtxIn, TBindings, {}, TOut> {
	return async (input) => {
		const validated = await schema["~standard"].validate(
			["POST", "PUT", "PATCH"].includes(input.method)
				? (input.body ?? {})
				: input.query,
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
