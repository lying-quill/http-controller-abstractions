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
> = (i) => {
	if (Math.random() < 0.5)
		// ><>
		throw new Error("This is an example error");

	return createTransformRecord(i, { meow: true });
};
