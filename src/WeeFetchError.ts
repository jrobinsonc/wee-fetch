import type { ResponseData as DefaultResponseData } from './types';

/**
 * WeeFetchError class.
 */
export default class WeeFetchError<
  ResponseData = DefaultResponseData,
> extends Error {
  /**
   * Response object.
   */
  response?: ResponseData;

  /**
   * Date of error.
   * Helps to know the browser's date of the error.
   */
  date?: Date;

  /**
   * Extra information about the error.
   */
  extra?: unknown;

  /**
   * Constructor.
   *
   * @param message - Error message.
   * @param response - Optional response object.
   */
  constructor(message: string, response?: ResponseData) {
    super(message);

    this.name = 'WeeFetchError';
    this.response = response;
    this.date = new Date();
  }
}
