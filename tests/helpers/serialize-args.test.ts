import serializeArgs from '../../src/helpers/serialize-args';

test('serialize normal object', () => {
  const args: Record<string, unknown> = {
    name: 'José Robinson',
    age: 20,
    active: true,
  };

  expect(serializeArgs(args, false)).toBe(
    'name=José Robinson&age=20&active=true',
  );
  expect(serializeArgs(args, true)).toBe(
    'name=Jos%C3%A9%20Robinson&age=20&active=true',
  );
});

test('check nullish values', () => {
  const args: Record<string, unknown> = {
    isTrue: true,
    isFalse: false,
    isNull: null,
    isUndefined: undefined,
  };

  expect(serializeArgs(args, false)).toBe('isTrue=true&isFalse=false');
  expect(serializeArgs(args, true)).toBe('isTrue=true&isFalse=false');
});

test('serialize URLSearchParams', () => {
  const args: URLSearchParams = new URLSearchParams();

  args.append('name', 'José Robinson');
  args.append('age', '20');
  args.append('active', 'true');

  expect(serializeArgs(args, false)).toBe(
    'name=José Robinson&age=20&active=true',
  );
  expect(serializeArgs(args, true)).toBe(
    'name=Jos%C3%A9%20Robinson&age=20&active=true',
  );
});

test('check with no args', () => {
  expect(serializeArgs(new URLSearchParams())).toBe('');
  expect(serializeArgs({})).toBe('');
});

test('check invalid argument', () => {
  expect(() => {
    serializeArgs('' as unknown as URLSearchParams);
  }).toThrow('Invalid object.');
});
