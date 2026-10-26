# http-controller-abstractions
Tiny TypeScript library for testable, clutter-free, framework-agnostic
controllers with strong type-safety.

## Overview
This library provides a lightweight, composable abstraction layer for building
HTTP controllers in TypeScript. It allows you to write clean, testable
controller logic that is completely decoupled from any specific HTTP framework.

The library handles:
- **Type-safe middleware composition** with full TypeScript inference
- **Framework agnostic** architecture - works with Express, Koa, or any other
  framework
- **Automatic error handling** with configurable error handlers
- **Status responses** with first-class support for HTTP status codes, headers,
  cookies, and redirects
- **Context propagation** through the middleware chain with type safety

## Key Concepts

### Middleware
A `Middleware` is the building block of controllers. It processes input,
maintains context, and produces output:

```typescript
type Middleware<
	TIn,
	TCtx extends {} = {},
	TBindings extends {} = {},
	TCtxOut extends {} = TCtx,
	TOut = TIn,
> = (
	input: Readonly<TIn>,
	context: Readonly<TCtx>,
	bindings: Readonly<TBindings>,
) => MaybePromise<TOut | TransformRecord<TOut, TCtxOut>>;
```

- **TIn**: The input type the middleware receives
- **TCtx**: The context type the middleware expects to receive (used for
  chaining)
- **TBindings**: The bindings type (injected services/dependencies)
- **TCtxOut**: The context type the middleware produces
- **TOut**: The output type the middleware produces. A middleware can transform
  its input and return a different value for the next middleware

### Controller
A `Controller` is a specialized middleware that returns typed HTTP status
responses:

```typescript
type Controller<
	TIn,
	TMap extends StatusMap,
	TCtx extends {} = {},
	TBindings extends {} = {},
> = Middleware<...>
```

It guarantees that the response is one of the statuses defined in `TMap`.

### Compose
The `Compose` class chains multiple middlewares together with automatic error
handling and type inference:

```typescript
const handler = Compose.new<RequestInput, ServiceBindings>()
	.with(authMiddleware)
	.with(validationMiddleware)
	.with(theController)
	.catch(errorHandler)
	.end();
```

### Response
The `Response` class represents an abstract HTTP response with status code,
body, and optional headers/cookies/redirect:

```typescript
new Response(200, { message: "OK" }, {
	headers: {
		"X-Custom": "value",
	},
	cookies: {
		sessionId: { value: "abc123" },
	},
});
```

## Installation
This project is not yet published on NPM registry, so to install it, you gotta:
```bash
npm install https://github.com/lying-quill/http-controller-abstractions
```

## Usage Examples
```typescript
import {
	createTransformRecord,
	bindResponse,
	type Controller,
	type Middleware,
} from "http-controller-abstractions";
import type Koa from "koa";

type DummyContext = { meow: true; };
type AuthContext = { user: null; }
type ServiceBindings = { db: null; }
type StatusMap = {
	200: { users: string[] };
};

const response = bindResponse<StatusMap>();

const controller: Controller<
	{},
	StatusMap,
	AuthContext,
	// pick the services you actually use here so testing is easier
	Pick<ServiceBindings, "db">
> = (input, ctx, svc) => response(200, { users: [String(ctx.user)] });

const dummyMiddleware: Middleware<
	Koa.Context,
	any,
	ServiceBindings,
	DummyContext
> = (i) => createTransformRecord(i, { meow: true });

const handler = Compose.new<RequestInput, ServiceBindings>()
	.with(dummyMiddleware)
	.with(controller)
	.end();
```

### Framework Integration

See the `examples/` directory for complete integration examples with:
- **Express** - `examples/express/`
- **Koa** - `examples/koa/`

These examples show how to adapt the abstract middleware to real HTTP frameworks.

## API Reference

### Compose

#### `Compose.new<TInput, TBindings>()`
Creates a new composition chain.

#### `.with<T>(middleware: Middleware<...>)`
Adds a middleware to the chain. Returns a new Compose instance with updated
types.

#### `.catch<T>(handler: (error: any) => MaybePromise<T>)`
Sets an error handler that catches exceptions thrown by middlewares. The return
type becomes part of the possible outputs. If nothing set, errors are not
caught. If called multiple times, the latest handler replaces previous ones.

#### `.end()`
Finalizes the composition and returns a
`Composed<TInitialInput, TCurrentOut | TErrorRet, TBindings>` function.

### Response
```typescript
class Response<TStatus, TBody, TOptions> {
	constructor(
		public readonly status: TStatus,
		public readonly body: TBody,
		public readonly options: ResponseOptions,
	);
}
```

#### ResponseOptions
```typescript
interface ResponseOptions {
	headers?: Record<string, string>;
	cookies?: Record<string, CookieOptions | null>;
	redirect?: string;
}
```

### Utilities

#### `createTransformRecord<TOut, TCtx>(out: TOut, ctx: TCtx)`
Creates a transform record to both update the output and add data to the
context. Middlewares can either return the modified output, or create a
special object called the `TransformRecord` using this utility, to declare both
output and context modification.

#### `isTransformRecord(o: unknown)`
Type guard to check if an object is a transform record.

## Features
- **Full TypeScript support** - Generic type parameters flow through the entire
  chain
- **Framework agnostic** - Works with any HTTP framework
- **Testable** - Controllers are pure functions with explicit inputs/outputs
- **Composable** - Build complex flows by chaining simple middlewares
- **Error handling** - Automatic error catching with custom handlers
- **Lightweight** - Zero dependencies

## License
Currently licensed under the [MIT license](https://mit-license.org/).
There's a copy of the [license](LICENSE) available along with the source code.
