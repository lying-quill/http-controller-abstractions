import Router from "@koa/router";
import Koa from "koa";
import { koaBody } from "koa-body";
import routes from "./routes";

const router = new Router();

// maybe call "loadServices" here so service availability is checked at startup

router.use(
	// ><>
	routes.routes(),
	routes.allowedMethods(),
);

new Koa()
	.use(koaBody())
	.use(router.routes())
	.use(router.allowedMethods())
	.listen(3000);
