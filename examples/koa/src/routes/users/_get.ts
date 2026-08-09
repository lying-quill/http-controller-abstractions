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
			.with(dummyMiddleware)
			// the order matters here because "jwtMiddleware" depends on
			// the "dummyMiddleware"
			.with(jwtMiddleware)
			.with(createBodyMiddleware(listUsersInputSchema))
			.with(listUsers)
			.with((input) => {
				// this is middleware that can transform the controller's response
				console.debug(input);
				return input;
			})
			.end(),
		// allows lazy-loading the service bindings.
		loadServices,
	),
);

export default router;
