/** biome-ignore-all lint/suspicious/noExplicitAny: ><> */
import type { Composed, Status } from "http-controller-abstractions";
import type Koa from "koa";

// TODO: this should become part of the library?

/** provides a koa middleware from the provided composed handler */
export function fromComposed<T, U extends Status>(
	composed: Composed<Koa.Context, U, T>,
	bindings: () => T | Promise<T>,
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

		if (result.options.cookies) {
			for (const cookieName in result.options.cookies) {
				// biome-ignore lint/style/noNonNullAssertion: ><>
				const c = result.options.cookies[cookieName]!;
				ctx.cookies.set(cookieName, c.value, c);
			}
		}

		if (result.options.headers) {
			ctx.set(result.options.headers);
		}

		await next();
	};
}
