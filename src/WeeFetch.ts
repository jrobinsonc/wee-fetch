import crossFetch from 'cross-fetch';
import type {
  BodyArgs,
  QueryArgs,
  RequestArgs,
  ResponseData as DefaultResponseData,
} from './types';
import buildUrl from './helpers/build-url';
import parseRequest from './helpers/parse-request';
import WeeFetchError from './WeeFetchError';

/**
 * WeeFetch class.
 */
export default class WeeFetch<BaseResponseData = DefaultResponseData> {
  /**
   * Base url that will be prepend to the requests.
   */
  public baseUrl: string;

  /**
   * Default request arguments.
   */
  public defArgs: RequestArgs;

  /**
   * Constructor.
   *
   * @param baseUrl - Optional base url.
   * @param defArgs - Optional request arguments.
   */
  constructor(baseUrl: string = '', defArgs: RequestArgs = {}) {
    this.baseUrl = baseUrl;
    this.defArgs = defArgs;
  }

  /**
   * Request.
   *
   * @throws {WeeFetchError} If the request could not be performed.
   * @param url - Request's url.
   * @param args - Request's arguments.
   * @returns Response's promise.
   */
  async request<ResponseData = BaseResponseData>(
    url: string,
    args: RequestArgs = {},
  ): Promise<ResponseData> {
    const parsedUrl: string = `${this.baseUrl}${url}`;
    const defaultHeaders: HeadersInit = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const parsedArgs: RequestInit = parseRequest({
      ...this.defArgs,
      ...args,
      headers: { ...defaultHeaders, ...(args.headers ?? {}) },
    });
    let response: Response;

    try {
      // For some reason eslint can't find the type definition for `cross-fetch`.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      response = (await crossFetch(parsedUrl, parsedArgs)) as Response;
    } catch (error) {
      const fetchError: WeeFetchError<ResponseData> =
        new WeeFetchError<ResponseData>('Network request failed');

      fetchError.extra = error;

      throw fetchError;
    }

    let jsonData: ResponseData;

    try {
      const responseText: string = await response.text();

      jsonData = JSON.parse(responseText) as ResponseData;
    } catch (error) {
      const fetchError: WeeFetchError<ResponseData> =
        new WeeFetchError<ResponseData>('Invalid JSON response received');

      fetchError.extra = error;

      throw fetchError;
    }

    return jsonData;
  }

  /**
   * Get's request.
   *
   * @param url - Url.
   * @param query - Optional query.
   * @param args - Optional arguments.
   * @returns Response's promise.
   */
  get<ResponseData = BaseResponseData>(
    url: string,
    query?: URLSearchParams | QueryArgs,
    args?: RequestArgs,
  ): Promise<ResponseData> {
    const parsedArgs: RequestArgs = {
      ...args,
      method: 'GET',
    };
    const parsedUrl: string = buildUrl(url, query);

    return this.request(parsedUrl, parsedArgs);
  }

  /**
   * Post's request.
   *
   * @param url - Url.
   * @param body - Optional body.
   * @param args - Optional arguments.
   * @returns Response's promise.
   */
  post<ResponseData = BaseResponseData>(
    url: string,
    body?: BodyArgs,
    args?: RequestArgs,
  ): Promise<ResponseData> {
    const parsedArgs: RequestArgs = {
      ...args,
      method: 'POST',
      body,
    };

    return this.request(url, parsedArgs);
  }

  /**
   * Put's request.
   *
   * @param url - Url.
   * @param body - Optional body.
   * @param args - Optional arguments.
   * @returns Response's promise.
   */
  put<ResponseData = BaseResponseData>(
    url: string,
    body?: BodyArgs,
    args?: RequestArgs,
  ): Promise<ResponseData> {
    const parsedArgs: RequestArgs = {
      ...args,
      method: 'PUT',
      body,
    };

    return this.request(url, parsedArgs);
  }

  /**
   * Delete's request.
   *
   * @param url - Url.
   * @param args - Optional arguments.
   * @returns Response's promise.
   */
  delete<ResponseData = BaseResponseData>(
    url: string,
    args?: RequestArgs,
  ): Promise<ResponseData> {
    const parsedArgs: RequestArgs = {
      ...args,
      method: 'DELETE',
    };

    return this.request(url, parsedArgs);
  }
}
