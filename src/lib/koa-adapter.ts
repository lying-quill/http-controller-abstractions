/** biome-ignore-all lint/suspicious/noExplicitAny: ><> */
/** biome-ignore-all lint/complexity/noBannedTypes: ><> */

import type { StandardSchemaV1 } from "@standard-schema/spec";
import type Koa from "koa";
import type { Composed } from "./compose";
import type { MaybePromise, Middleware } from "./controller";

/** provides a koa middleware from the provided composed handler */
export function fromComposed<TBindings>(
	composed: Composed<Koa.Context, TBindings>,
	bindings: () => MaybePromise<TBindings>,
) {
	return async (ctx: Koa.Context, next: Koa.Next) => {
		const binds = await bindings?.();
		const result = await composed(ctx, binds);

		// http status
		ctx.status = result.status;

		if (result.options.redirect) {
			ctx.redirect(result.options.redirect);
		} else {
			ctx.body = result.body;
		}

		// FIXME: this is a bad idea:
		// if (result.options.cookies) {
		// 	for (const cookieName in result.options.cookies) {
		// 		ctx.cookies.set(cookieName, result.options.cookies[cookieName]);
		// 	}
		// }

		if (result.options.headers) {
			ctx.set(result.options.headers);
		}

		await next();
	};
}

export class ValidationError extends Error {
	public readonly name: string = "ValidationError";

	constructor(issues: string[], schema: StandardSchemaV1) {
		super();
		this.message = issues.join("; ");
		this.cause = schema;
	}
}

export function createBodyMiddleware<TIn, TOut, TBindings, TCtxIn>(
	schema: StandardSchemaV1<TIn, TOut>,
): Middleware<
	Koa.Context,
	TBindings,
	TCtxIn,
	/* input context is not modified */ TCtxIn,
	TOut
> {
	return async (input, context) => {
		const validated = await schema["~standard"].validate(input.request.body);

		if ("issues" in validated && validated.issues)
			// ><>
			throw new ValidationError(
				validated.issues.map((i) => i.message),
				schema,
			);

		return {
			input: validated.value,
			context,
		};
	};
}
