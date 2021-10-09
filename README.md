# wee-fetch

Isomorphic and minimalistic promise-based HTTP client for the browser, Node and React Native, focused to be used with JSON endpoints. Built on top of [cross-fetch](https://www.npmjs.com/package/cross-fetch).

☑ Test browser.  
☑ Test Node.  
☐ Test React Native.  
☐ Implement middlewares   

# How to use

This is something I built for my own use a while ago and now is public but lacking documentation. Down here you have a quick example of usage.

```js
// => utils/api.js
import Fetch from 'wee-fetch';

const api = new Fetch(process.env.API_URL);

export default api;

// => users.js
import api from './utils/api.js';

// You can use .get(), .post(), .put(), and .delete().
api.get('/users')
    .then((usersList) => {
      // usersList is JSON-parsed data returned by the back-end endpoint.
    })
    .catch(() => {
      alert('Ops, something went wrong!');
    });
```
