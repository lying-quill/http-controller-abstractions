import type * as Express from "express";
import {
	createTransformRecord,
	type Middleware,
} from "http-controller-abstractions";
import type { DummyContext, ServiceBindings } from "~/bindings";

export const dummyMiddleware: Middleware<
	Express.Request,
	any,
	ServiceBindings,
	DummyContext
> = (i) =>
	// ><>
	createTransformRecord(i, { meow: true });
