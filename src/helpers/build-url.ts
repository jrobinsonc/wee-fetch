import serializeArgs from './serialize-args';
import type { QueryArgs } from '../types';

/**
 * Builds the url with the query provided.
 *
 * @param url - Url.
 * @param query - Query.
 * @returns The url with the query.
 */
export default function buildUrl(
  url: string,
  query?: URLSearchParams | QueryArgs,
): string {
  const qs: string = query ? serializeArgs(query) : '';

  if (qs === '') {
    return url;
  }

  return `${url}?${qs}`;
}
