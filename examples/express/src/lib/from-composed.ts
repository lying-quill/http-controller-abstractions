import type * as Express from "express";
import type { Composed, Response } from "http-controller-abstractions";

export function fromComposed<T, U extends Response>(
	composed: Composed<Express.Request, U, T>,
	bindings: () => T | Promise<T>,
) {
	return async (req: Express.Request, res: Express.Response) => {
		const binds = await bindings();
		const result = await composed(req, binds);

		if (result.options.cookies) {
			for (const cookieName in result.options.cookies) {
				// biome-ignore lint/style/noNonNullAssertion: ><>
				const c = result.options.cookies[cookieName]!;
				res.cookie(cookieName, c.value, c);
			}
		}

		if (result.options.headers) {
			res.header(result.options.headers);
		}

		// http status
		res.status(result.status);

		if (result.options.redirect) {
			res.redirect(result.options.redirect);
		} else {
			res.send(result.body);
		}

		res.end();
	};
}
