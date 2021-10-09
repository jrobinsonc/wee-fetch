import crossFetch from 'cross-fetch';

type QueryArgs = Record<string, unknown>;
type BodyArgs = QueryArgs | URLSearchParams | FormData | string;

interface RequestArgs extends Omit<RequestInit, 'body'> {
  body?: BodyArgs;
}

/**
 * @package wee-fetch
 */
export default class WeeFetch<ResponseType> {
  /**
   * Base url that will be prepend to the requests.
   */
  public baseUrl: string;

  public defArgs: RequestInit;

  constructor(baseUrl: string, defArgs: RequestInit | undefined = undefined) {
    this.baseUrl = baseUrl;
    this.defArgs = defArgs ?? {};
  }

  parseArgs({
    headers: requestHeaders,
    body: requestBody,
    ...requestArgs
  }: RequestArgs): RequestInit {
    const headers: HeadersInit = {
      ...(requestHeaders ?? {}),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let body: BodyInit | undefined;

    switch (true) {
      case requestBody instanceof URLSearchParams:
        body = requestBody as URLSearchParams;
        break;

      // FormData does not exists on Node, only on the browser.
      case typeof FormData === 'function' && requestBody instanceof FormData:
        body = requestBody as FormData;

        // When using FormData to submit POST/PUT requests, do not explicitly set the
        // Content-Type header on the request. Doing so will prevent the browser
        // from being able to set the Content-Type header with the boundary
        // expression it will use to delimit form fields in the request body.
        if ('Content-Type' in headers) {
          delete headers['Content-Type'];
        }
        break;

      // Here we are assuming the body is a plain object.
      default:
        body = JSON.stringify(requestBody);
        break;
    }

    return {
      headers,
      body,
      credentials: 'include',
      ...this.defArgs,
      ...requestArgs,
    } as RequestInit;
  }

  async request(
    url: string,
    args: RequestArgs | undefined = undefined,
  ): Promise<ResponseType> {
    const parsedUrl = `${this.baseUrl}/${url}`;
    const parsedArgs = this.parseArgs(args ?? {});

    const output = crossFetch(parsedUrl, parsedArgs)
      .then(async (response: Response): Promise<string> => {
        return response.text();
      })
      .then((responseText): ResponseType => {
        try {
          const jsonData = JSON.parse(responseText) as ResponseType;

          return jsonData;
        } catch {
          throw new Error('Invalid JSON response received.');
        }
      });

    return output;
  }

  static serializeQueryArgs(
    query: URLSearchParams | QueryArgs | undefined = undefined,
  ): string {
    const entries = typeof query === 'undefined' ? [] : Object.entries(query);

    if (entries.length === 0) {
      return '';
    }

    return entries
      .filter(([, value]) => value !== null) // Remove null values.
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`) // Encode values.
      .join('&');
  }

  static buildUrl(
    url: string,
    query: URLSearchParams | QueryArgs | undefined = undefined,
  ): string {
    const qs = WeeFetch.serializeQueryArgs(query);

    if (qs === '') {
      return url;
    }

    return `${url}?${qs}`;
  }

  async get(
    url: string,
    query: URLSearchParams | QueryArgs | undefined = undefined,
    args: RequestArgs | undefined = undefined,
  ): Promise<ResponseType> {
    const parsedArgs: RequestArgs = {
      ...args,
      method: 'GET',
    };
    const parsedUrl = WeeFetch.buildUrl(url, query);

    return this.request(parsedUrl, parsedArgs);
  }

  async post(
    url: string,
    body: BodyArgs | undefined = undefined,
    args: RequestArgs | undefined = undefined,
  ): Promise<ResponseType> {
    const parsedArgs: RequestArgs = {
      ...args,
      method: 'POST',
      body,
    };

    return this.request(url, parsedArgs);
  }

  async put(
    url: string,
    body: BodyArgs | undefined = undefined,
    args: RequestArgs | undefined = undefined,
  ): Promise<ResponseType> {
    const parsedArgs: RequestArgs = {
      ...args,
      method: 'PUT',
      body,
    };

    return this.request(url, parsedArgs);
  }

  async delete(
    url: string,
    args: RequestArgs | undefined = undefined,
  ): Promise<ResponseType> {
    const parsedArgs: RequestArgs = {
      ...args,
      method: 'DELETE',
    };

    return this.request(url, parsedArgs);
  }
}
