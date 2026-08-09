import {
	createTransformRecord,
	type Middleware,
} from "http-controller-abstractions";
import type Koa from "koa";
import type { AuthContext, DummyContext, ServiceBindings } from "~/bindings";

export const jwtMiddleware: Middleware<
	Koa.Context,
	// this middleware depends on dummyMiddleware for some reason
	DummyContext,
	ServiceBindings,
	AuthContext
> = (i) =>
	// ><>
	createTransformRecord(i, { user: null });
