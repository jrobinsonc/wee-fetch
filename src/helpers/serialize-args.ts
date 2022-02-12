import WeeFetchError from '../WeeFetchError';

/**
 * Serialize query arguments.
 *
 * @throws {WeeFetchError} If the object is not a valid object.
 * @param query - Query arguments.
 * @param encode - Optional. Wether or not the values should be encoded.
 * @returns Serialized query arguments.
 */
export default function serializeArgs(
  query: URLSearchParams | Record<string, unknown>,
  encode: boolean = true,
): string {
  let entries: [string, unknown][] = [];

  switch (true) {
    case query instanceof URLSearchParams:
      (query as URLSearchParams).forEach((value: string, key: string) => {
        entries.push([key, value]);
      });
      break;

    case query !== null && typeof query === 'object':
      entries = Object.entries(query);
      break;

    default:
      throw new WeeFetchError('Invalid object.');
  }

  if (entries.length === 0) {
    return '';
  }

  return entries
    .reduce((acc: string[], [key, value]: [string, unknown]) => {
      if (value !== null && value !== undefined) {
        acc.push(
          encode
            ? `${key}=${encodeURIComponent(String(value))}`
            : `${key}=${String(value)}`,
        );
      }

      return acc;
    }, [])
    .join('&');
}
