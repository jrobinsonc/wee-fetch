declare type QueryArgs = Record<string, unknown>;
declare type BodyArgs = QueryArgs | URLSearchParams | FormData;
interface RequestArgs extends Omit<RequestInit, 'body'> {
    body?: BodyArgs;
}
/**
 * @package Fetcher
 * @fixme FormData only exists on clint-side, so using this on server-side will give a ReferenceError.
 */
export default class Fetcher<ResponseType> {
    /**
     * Base url that will be prepend to the requests.
     */
    baseUrl: string;
    defArgs: RequestInit;
    constructor(baseUrl: string, defArgs?: RequestInit | undefined);
    request(url: string, args?: RequestArgs | undefined): Promise<ResponseType>;
    static serializeQueryArgs(query?: URLSearchParams | QueryArgs | undefined): string;
    static buildUrl(url: string, query?: URLSearchParams | QueryArgs | undefined): string;
    get(url: string, query?: URLSearchParams | QueryArgs | undefined, args?: RequestArgs | undefined): Promise<ResponseType>;
    post(url: string, body?: BodyArgs | undefined, args?: RequestArgs | undefined): Promise<ResponseType>;
    put(url: string, body?: BodyArgs | undefined, args?: RequestArgs | undefined): Promise<ResponseType>;
    delete(url: string, args?: RequestArgs | undefined): Promise<ResponseType>;
}
export {};
