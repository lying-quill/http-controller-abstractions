import type * as Express from "express";
import express from "express";
import { Compose, Response } from "http-controller-abstractions";
import type { ServiceBindings } from "~/bindings";
import listUsers, {
	inputSchema as listUsersInputSchema,
} from "~/controllers/list-users";
import {
	createBodyMiddleware,
	ValidationError,
} from "~/lib/create-body-middleware";
import { fromComposed } from "~/lib/from-composed";
import { loadServices } from "~/lib/load-services";
import { dummyMiddleware } from "~/middlewares/dummy";
import { jwtMiddleware } from "~/middlewares/jwt";

const router = express.Router();

router.get(
	"/",
	fromComposed(
		Compose.new<Express.Request, ServiceBindings>()
			.with(dummyMiddleware)
			// the order matters here because "jwtMiddleware" depends on
			// the "dummyMiddleware"
			.with(jwtMiddleware)
			.with(createBodyMiddleware(listUsersInputSchema))
			.with(listUsers)
			.with((input) => {
				// this middleware can transform the controller's response.
				console.debug("controller output=", input);
				return input;
			})
			.catch(async (e) => {
				console.debug("error=", e);

				await new Promise((r) => setTimeout(r, 1000));

				if (e instanceof ValidationError)
					return new Response(422, { error: "Validation Error" }, {});

				return new Response(500, String(e), {});
			})
			.end(),
		// allows lazy-loading the service bindings.
		loadServices,
	),
);

export default router;
