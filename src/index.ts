import Router from "@koa/router";
import Koa from "koa";
import { koaBody } from "koa-body";
import type * as App from "./app/bindings";
import {
	listUsers,
	inputSchema as listUsersInputSchema,
} from "./controllers/users/list";
import { Compose } from "./lib/compose";
import { createBodyMiddleware, fromComposed } from "./lib/koa-adapter";
import { koaJwtMiddleware } from "./middlewares/koa-jwt";

const router = new Router();

router.get(
	"/users",
	fromComposed(
		Compose.new<Koa.Context, App.ServiceBindings>()
			.before(koaJwtMiddleware)
			.before(createBodyMiddleware(listUsersInputSchema))
			.end(listUsers),
		// this provides the service bindings
		() => ({
			db: {
				/* database */
			},
		}),
	),
);

new Koa()
	.use(koaBody())
	.use(router.routes())
	.use(router.allowedMethods())
	.listen(3000);
