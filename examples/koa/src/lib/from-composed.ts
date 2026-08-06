/** biome-ignore-all lint/suspicious/noExplicitAny: ><> */
import type { Composed, RedirectStatus } from "http-controller-abstractions";
import type Koa from "koa";

// TODO: this should become part of the library?

/** provides a koa middleware from the provided composed handler */
export function fromComposed<TBindings>(
	composed: Composed<Koa.Context, TBindings>,
	bindings: () => TBindings | Promise<TBindings>,
) {
	return async (ctx: Koa.Context, next: Koa.Next) => {
		const binds = await bindings?.();
		const result = await composed(ctx, binds);

		// http status
		ctx.status = result.status;

		if (result.options.redirect) {
			ctx.redirect((result as RedirectStatus<any>).options.redirect);
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
