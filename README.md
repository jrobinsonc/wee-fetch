# wee-fetch

Isomorphic and minimalistic promise-based HTTP client for the browser, Node and React Native, focused to be used with JSON endpoints. Built on top of [cross-fetch](https://www.npmjs.com/package/cross-fetch).

☑ Test browser.  
☑ Test Node.  
☐ Test React Native.  
☐ Implement middlewares   

# How to use

This is something I built for my own use a while ago and now is public but lacking documentation. Down here you have a quick example of usage.

```js
import Fetch from 'wee-fetch';

const api = new Fetch('https://domain.com/api/v1/');

// Using GET
api.get('users')
  .then((usersList) => {
    doSomethingWith(usersList);
  })
  .catch(() => {
    alert('Ops, the list of users could not be retreived!');
  });

// Using PUT
api.put('users/1', { name: 'John Doe' })
  .then((usersList) => {
    alert('User updated!');
  })
  .catch(() => {
    alert('Ops, the user could not be updated!');
  });
```

## License

MIT License © 2021 [Jose Robinson](https://joserobinson.com)
