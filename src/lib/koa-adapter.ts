/** biome-ignore-all lint/suspicious/noExplicitAny: ><> */
/** biome-ignore-all lint/complexity/noBannedTypes: ><> */

import type { StandardSchemaV1 } from "@standard-schema/spec";
import type Koa from "koa";
import type { Composed } from "./compose";
import type { MaybePromise, Middleware } from "./controller";

/** provides a koa middleware from the provided composed handler */
export function wrap<TBindings>(
	composed: Composed<Koa.Context, TBindings>,
	bindings?: () => MaybePromise<TBindings>,
) /*: (ctx: NormalizedKoaContext, next: Koa.Next) => Promise<void> */ {
	return async (ctx: Koa.Context, next: Koa.Next) => {
		const binds = await bindings?.();
		const status = await composed(ctx, binds);

		ctx.status = status.status;

		if (status.options.redirect) {
			ctx.redirect(status.options.redirect);
		} else {
			ctx.body = status.body;
		}

		// FIXME:
		// ctx.cookies.set

		if (status.options.headers) {
			ctx.set(status.options.headers);
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
