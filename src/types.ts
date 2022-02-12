/**
 * Query's arguments type.
 */
export type QueryArgs = Record<string, string | number | boolean>;

/**
 * Body's arguments type.
 */
export type BodyArgs = QueryArgs | FormData | URLSearchParams;

/**
 * Request's arguments interface.
 */
export interface RequestArgs extends Omit<RequestInit, 'body'> {
  body?: BodyArgs;
}

/**
 * Default response type.
 */
export type ResponseData = Record<string, unknown>;
