import Router from "@koa/router";
import _get from "./_get";

const router = new Router({ prefix: "/users" });

router.use(
	// ><>
	_get.routes(),
	_get.allowedMethods(),
);

export default router;
