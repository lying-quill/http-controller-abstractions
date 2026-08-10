import type * as Express from "express";
import {
	createTransformRecord,
	type Middleware,
} from "http-controller-abstractions";

import type { AuthContext, DummyContext, ServiceBindings } from "~/bindings";

export const jwtMiddleware: Middleware<
	Express.Request,
	// this middleware depends on dummyMiddleware for some reason
	DummyContext,
	ServiceBindings,
	AuthContext
> = (i) =>
	// ><>
	createTransformRecord(i, { user: null });
