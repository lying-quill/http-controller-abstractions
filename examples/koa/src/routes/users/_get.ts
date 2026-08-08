import Router from "@koa/router";
import { Compose } from "http-controller-abstractions";
import type Koa from "koa";
import type { ServiceBindings } from "~/bindings";
import listUsers, {
	inputSchema as listUsersInputSchema,
} from "~/controllers/list-users";
import { createBodyMiddleware } from "~/lib/create-body-middleware";
import { fromComposed } from "~/lib/from-composed";
import { loadServices } from "~/lib/load-services";
import { dummyMiddleware } from "~/middlewares/dummy";
import { jwtMiddleware } from "~/middlewares/jwt";

const router = new Router();

router.get(
	"/",
	fromComposed(
		Compose.new<Koa.Context, ServiceBindings>()
			.before(dummyMiddleware)
			// the order matters here because "jwtMiddleware" depends on
			// the "dummyMiddleware"
			.before(jwtMiddleware)
			.before(createBodyMiddleware(listUsersInputSchema))
			.before((input, context) => {
				console.debug(context);
				return { input, context };
			})
			.end(listUsers),
		// allows lazy-loading the service bindings.
		loadServices,
	),
);

export default router;
