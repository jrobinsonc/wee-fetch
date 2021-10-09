import fetch from 'cross-fetch';
import { mocked } from 'ts-jest/utils';
import Fetch from '../src/index';

jest.mock('cross-fetch', () => {
  return jest.fn((url, request) => {
    const response: Record<'code'|'data', unknown> = {
      code: null,
      data: null
    };

    switch (request.method) {
      case 'POST':
        response.code = 'ok';
        response.data = {
          id: 1
        };
        break;

      case 'PUT':
        response.code = 'ok';
        break;

      case 'GET':
        response.code = 'ok';
        response.data = {
          id: 1,
          name: 'Jose',
        };
        break;

      case 'DELETE':
        response.code = 'ok';
        break;
    }

    return Promise.resolve({
      text() {
        return Promise.resolve(JSON.stringify([url, request, response]));
      }
    });
  });
});

beforeEach(() => {
  mocked(fetch).mockClear();
});

const baseUrl = 'https://fakeurl.com';
const getApi = () => new Fetch(baseUrl);

describe('Fetch', () => {
  test('should post JSON data', async () => {
    const endpoint = '/users';
    const body = {name: 'Jose'};
    const [url, req, res] = await getApi()
      .post(endpoint, body) as [string, Record<string, unknown>, Record<string, unknown>];

    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(url).toBe(`${baseUrl}/${endpoint}`);
    expect(req).toHaveProperty('method', 'POST');
    expect(req).toHaveProperty('body', JSON.stringify(body));
    expect(res).toHaveProperty('code', 'ok');
    expect(res).toHaveProperty('data.id', 1);
  });

  // test('should post FormData data', async () => {
  //   const endpoint = '/users';

  //   let body;

  //   if (typeof FormData === 'function') {
  //     body = new FormData;
  //     body.append('name', 'Jose');
  //   }

  //   const [url, req, res] = await getApi()
  //     .post(endpoint, body) as [string, Record<string, unknown>, Record<string, unknown>];

  //   expect(mocked(fetch).mock.calls.length).toBe(1);
  //   expect(url).toBe(`${baseUrl}/${endpoint}`);
  //   expect(req).toHaveProperty('method', 'POST');
  //   expect(req).toHaveProperty('body', JSON.stringify(body));
  //   expect(res).toHaveProperty('code', 'ok');
  //   expect(res).toHaveProperty('data.id', 1);
  // });

  test('should put JSON data', async () => {
    const endpoint = '/users/1';
    const body = {name: 'Pepe'};
    const [url, req, res] = await getApi()
      .put(endpoint, body) as [string, Record<string, unknown>, Record<string, unknown>];

    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(url).toBe(`${baseUrl}/${endpoint}`);
    expect(req).toHaveProperty('method', 'PUT');
    expect(req).toHaveProperty('body', JSON.stringify(body));
    expect(res).toHaveProperty('code', 'ok');
    expect(res).toHaveProperty('data', null);
  });

  test('should get data', async () => {
    const endpoint = 'users/1';
    const [url, req, res] = await getApi()
      .get(endpoint) as [string, Record<string, unknown>, Record<string, unknown>];

    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(url).toBe(`${baseUrl}/${endpoint}`);
    expect(req).toHaveProperty('method', 'GET');
    expect(req).toHaveProperty('body', undefined);
    expect(res).toHaveProperty('code', 'ok');
    expect(res).toHaveProperty('data.id', 1);
    expect(res).toHaveProperty('data.name', 'Jose');
  });

  test('should get data with query in url', async () => {
    const endpoint = 'users?name=Jose&limit=10';
    const [url, req, res] = await getApi()
      .get(endpoint) as [string, Record<string, unknown>, Record<string, unknown>];

    const parsedUrl = new URL(url);

    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(url).toBe(`${baseUrl}/${endpoint}`);
    expect(parsedUrl.searchParams.get('name')).toBe('Jose');
    expect(parsedUrl.searchParams.get('limit')).toBe('10');
    expect(req).toHaveProperty('method', 'GET');
    expect(req).toHaveProperty('body', undefined);
    expect(res).toHaveProperty('code', 'ok');
    expect(res).toHaveProperty('data.id', 1);
    expect(res).toHaveProperty('data.name', 'Jose');
  });

  test('should get data with query in 2nd parameter', async () => {
    const endpoint = 'users';
    const params = {name: 'Jose', limit: '10'};
    const [url, req, res] = await getApi()
      .get(endpoint, params) as [string, Record<string, unknown>, Record<string, unknown>];

    const parsedUrl = new URL(url);
    const urlSerachParams = new URLSearchParams(params);

    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(url).toBe(`${baseUrl}/${endpoint}?${urlSerachParams.toString()}`);
    expect(parsedUrl.searchParams.get('name')).toBe('Jose');
    expect(parsedUrl.searchParams.get('limit')).toBe('10');
    expect(req).toHaveProperty('method', 'GET');
    expect(req).toHaveProperty('body', undefined);
    expect(res).toHaveProperty('code', 'ok');
    expect(res).toHaveProperty('data.id', 1);
    expect(res).toHaveProperty('data.name', 'Jose');
  });

  test('should delete data', async () => {
    const endpoint = 'users/1';
    const [url, req, res] = await getApi()
      .delete(endpoint) as [string, Record<string, unknown>, Record<string, unknown>];

    expect(mocked(fetch).mock.calls.length).toBe(1);
    expect(url).toBe(`${baseUrl}/${endpoint}`);
    expect(req).toHaveProperty('method', 'DELETE');
    expect(req).toHaveProperty('body', undefined);
    expect(res).toHaveProperty('code', 'ok');
    expect(res).toHaveProperty('data', null);
  });

});
