import {
	createTransformRecord,
	type Middleware,
} from "http-controller-abstractions";
import type Koa from "koa";
import type { DummyContext, ServiceBindings } from "~/bindings";

export const dummyMiddleware: Middleware<
	Koa.Context,
	any,
	ServiceBindings,
	DummyContext
> = (i) =>
	// ><>
	createTransformRecord(i, { meow: true });
