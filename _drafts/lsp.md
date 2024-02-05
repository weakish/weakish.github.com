# On Language Server Protocol

## Documentation

I first read the [Language Server Extension Guide][extension],
which I find too releated to VSCode specific things.
Then I read [Language Server Protocol Overview][overview],
which I find is cleaner.
After that, I read the [specification][spec].

[extension]: https://code.visualstudio.com/api/language-extensions/language-server-extension-guide
[overview]: https://microsoft.github.io/language-server-protocol/
[spec]: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/

## Base Protocol

Similarly to HTTP, there is a header and a body.

### Header

```
Content-Length: number
Content-Type: string  
```

The default value of `Content-Type` is `application/vscode-jsonrpc; charset=utf-8`.

The header is ascii encoded and `\r\n` terminated.

### Body

JSON-RPC encoded in utf-8, with `jsonrpc` version `2.0`.

#### Request

```ts
interface RequestMessage extends Message {

	/**
	 * The request id.
	 */
	id: integer | string;

	/**
	 * The method to be invoked.
	 */
	method: string;

	/**
	 * The method's params.
	 */
	params?: array | object;
}
```

#### Response

```ts
interface ResponseMessage extends Message {
	/**
	 * The request id.
	 */
	id: integer | string | null;

	/**
	 * The result of a request. This member is REQUIRED on success.
	 * This member MUST NOT exist if there was an error invoking the method.
	 */
	result?: string | number | boolean | array | object | null;

	/**
	 * The error object in case a request fails.
	 */
	error?: ResponseError;
}

interface ResponseError {
	/**
	 * A number indicating the error type that occurred.
	 */
	code: integer;

	/**
	 * A string providing a short description of the error.
	 */
	message: string;

	/**
	 * A primitive or structured value that contains additional
	 * information about the error. Can be omitted.
	 */
	data?: string | number | boolean | array | object | null;
}
```

#### Notification

A processed notification message must not send a response back.

```ts
interface NotificationMessage extends Message {
	/**
	 * The method to be invoked.
	 */
	method: string;

	/**
	 * The notification's params.
	 */
	params?: array | object;
}
```

## Text Documents

Prior to 3.17 the offsets were always based on a UTF-16 string representation.
Since 3.17 clients and servers can agree on using UTF-8, UTF-16, or UTF-32.

## Lifecycle

Lifecycle of a server is managed by the client. 
The client starts and shutdowns a server.

## Communication Channels

Servers usually support different channels, for example, stdio, socket file, socket, etc.
