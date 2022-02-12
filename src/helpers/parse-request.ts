import { RequestArgs } from '../types';
import WeeFetchError from '../WeeFetchError';

/**
 * Parse request's arguments.
 *
 * @throws {WeeFetchError} If the body is invalid.
 * @param args - Request's arguments.
 * @returns Parsed arguments.
 */
export default function parseRequest(args: RequestArgs): RequestInit {
  const { headers, body, ...requestArgs }: RequestArgs = args;
  let parsedBody: BodyInit | undefined;
  const parsedHeaders: HeadersInit = headers;

  switch (true) {
    case body === undefined:
      parsedBody = undefined;
      break;

    case body instanceof URLSearchParams:
      parsedBody = body as URLSearchParams;
      break;

    // FormData does not exists on Node, only on the browser.
    case typeof FormData === 'function' && body instanceof FormData:
      parsedBody = body as FormData;

      // When using FormData to submit POST/PUT requests, do not explicitly set the
      // Content-Type header on the request. Doing so will prevent the browser
      // from being able to set the Content-Type header with the boundary
      // expression it will use to delimit form fields in the request body.
      if ('Content-Type' in parsedHeaders) {
        delete parsedHeaders['Content-Type'];
      }
      break;

    // Here we are assuming the body is a plain object.
    case body !== null && typeof body === 'object':
      parsedBody = JSON.stringify(body);
      break;

    default:
      throw new WeeFetchError('Unsupported request body type.');
  }

  return {
    headers: parsedHeaders,
    body: parsedBody,
    // FIXME: credentials should not be here; it should be passed from the class since this is something that could be passed or no.
    credentials: 'include',
    ...requestArgs,
  };
}
