import crossFetch from 'cross-fetch';
import type { BodyArgs } from '../src/types';
import WeeFetch from '../src/index';

type ResponseData = [string, RequestInit];

jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn((url: string, request: RequestInit) => {
      return Promise.resolve({
        text: () => {
          const response: ResponseData = [url, request];

          return Promise.resolve(JSON.stringify(response));
        },
      });
    }),
  };
});

beforeEach(() => {
  (crossFetch as jest.Mock).mockClear();
});

const baseUrl: string = 'https://fakeurl.com/';
const defArgs: Record<string, string> = { credentials: 'include' };

test('should return valid instance', () => {
  const api: WeeFetch<ResponseData> = new WeeFetch<ResponseData>(
    baseUrl,
    defArgs,
  );

  expect(api).toBeInstanceOf(WeeFetch);
  expect(api).toHaveProperty('baseUrl', baseUrl);
  expect(api).toHaveProperty('defArgs', defArgs);
});

test('should not require a base URL', async () => {
  const api: WeeFetch<ResponseData> = new WeeFetch<ResponseData>();

  const [url]: ResponseData = await api.request('http://fullurl.com');

  expect(url).toBe('http://fullurl.com');
});

test('should set request args', async () => {
  const api: WeeFetch<ResponseData> = new WeeFetch<ResponseData>(
    baseUrl,
    defArgs,
  );
  const [, req]: ResponseData = await api.request('request-args');

  expect(crossFetch).toHaveBeenCalledTimes(1);
  expect(req).toHaveProperty('credentials', defArgs.credentials);
});

test('should set request headers', async () => {
  const api: WeeFetch<ResponseData> = new WeeFetch<ResponseData>(baseUrl);
  const [, req]: ResponseData = await api.request('request-headers', {
    headers: { 'x-test': 'test' },
  });

  expect(crossFetch).toHaveBeenCalledTimes(1);
  expect(req).toHaveProperty('headers.x-test', 'test');
});

test('should GET data', async () => {
  const path: string = 'users/1';
  const api: WeeFetch<ResponseData> = new WeeFetch<ResponseData>(baseUrl);
  const [url, req]: ResponseData = await api.get(path);

  expect(crossFetch).toHaveBeenCalledTimes(1);
  expect(url).toBe(`${baseUrl}${path}`);
  expect(req).toHaveProperty('method', 'GET');
  expect(req).toHaveProperty('body', undefined);
});

test('should POST a plain object', async () => {
  const path: string = 'post-plain-object';
  const body: BodyArgs = { type: 'post plain object' };
  const api: WeeFetch<ResponseData> = new WeeFetch<ResponseData>(baseUrl);
  const [url, req]: ResponseData = await api.post(path, body);

  expect(crossFetch).toHaveBeenCalledTimes(1);
  expect(url).toBe(`${baseUrl}${path}`);
  expect(req).toHaveProperty('method', 'POST');
  expect(req).toHaveProperty('body', JSON.stringify(body));
});

test('should PUT a plain object', async () => {
  const path: string = 'put-plain-object';
  const body: BodyArgs = { type: 'put plain object' };
  const api: WeeFetch<ResponseData> = new WeeFetch<ResponseData>(baseUrl);
  const [url, req]: ResponseData = await api.put(path, body);

  expect(crossFetch).toHaveBeenCalledTimes(1);
  expect(url).toBe(`${baseUrl}${path}`);
  expect(req).toHaveProperty('method', 'PUT');
  expect(req).toHaveProperty('body', JSON.stringify(body));
});

test('should DELETE', async () => {
  const path: string = 'delete-something';
  const api: WeeFetch<ResponseData> = new WeeFetch<ResponseData>(baseUrl);
  const [url, req]: ResponseData = await api.delete(path);

  expect(crossFetch).toHaveBeenCalledTimes(1);
  expect(url).toBe(`${baseUrl}${path}`);
  expect(req).toHaveProperty('method', 'DELETE');
});

test('throw error on network issue', () => {
  expect.assertions(3);

  (crossFetch as jest.Mock).mockImplementation(() => {
    throw new Error('Network error');
  });

  const api: WeeFetch<ResponseData> = new WeeFetch<ResponseData>(baseUrl);

  return api.get('network-error').catch((err: Error) => {
    expect(crossFetch).toHaveBeenCalledTimes(1);
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty('message', 'Network request failed');
  });
});

test('throw error if response is not JSON', () => {
  expect.assertions(3);

  (crossFetch as jest.Mock).mockImplementation(() => {
    return Promise.resolve({
      text: () => 'not-json',
    });
  });

  const api: WeeFetch<ResponseData> = new WeeFetch<ResponseData>(baseUrl);

  return api.get('network-error').catch((err: Error) => {
    expect(crossFetch).toHaveBeenCalledTimes(1);
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty('message', 'Invalid JSON response received');
  });
});
