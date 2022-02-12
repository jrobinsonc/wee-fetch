import WeeFetchError from '../src/WeeFetchError';

test('check error with response', () => {
  type ResponseData = Record<string, string>;

  const response: ResponseData = { name: 'Jose' };
  const error: WeeFetchError<ResponseData> = new WeeFetchError<ResponseData>(
    'Testing',
    response,
  );

  error.extra = { age: '30' };

  expect(error).toBeInstanceOf(WeeFetchError);
  expect(error).toHaveProperty('message', 'Testing');
  expect(error).toHaveProperty('date');
  expect(error.date).toBeInstanceOf(Date);
  expect(error).toHaveProperty('response', response);
  expect(error).toHaveProperty('extra', error.extra);
});
