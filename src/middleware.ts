import type { BaseMiddleware } from "./common";

export type TransformRecord<TOut, TCtx extends {}> = {
	readonly [transformKey]: true;
	out: TOut;
	ctx: TCtx;
};

export type Middleware<
	TIn,
	TCtx extends {} = {},
	TBindings extends {} = {},
	TCtxOut extends {} = TCtx,
	TOut = TIn,
> = BaseMiddleware<TIn, TCtx, TBindings, TOut | TransformRecord<TOut, TCtxOut>>;

const transformKey: unique symbol = Symbol("transformRecordSym");

export function createTransformRecord<TOut, TCtx extends {}>(
	out: TOut,
	ctx: TCtx,
): TransformRecord<TOut, TCtx> {
	return {
		[transformKey]: true,
		out,
		ctx,
	};
}

export function isTransformRecord(
	o: unknown,
): o is TransformRecord<unknown, {}> {
	return (
		typeof o === "object" &&
		o !== null &&
		transformKey in o &&
		o[transformKey] === true
	);
}
