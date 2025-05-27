# Node.js/NestJS Currency Convert Challenge

## Running local
### Makes sure that you are using NodeJS 20 version or latest
```
npm install
```

### Create a .env file on app root and add the currencyapi API key 
````
CURRENCY_API_KEY=[CURRENCY_API_KEY_VALUE]
````
````
npm run start:dev
````

### Manual testing
#### Install [RestClient](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) on your Visual Studio Code
navigate to folder ./test/test.transactions.local.http and test it.

### Automatic Testing (unit test and e2e tests)
#### Run
````
npm run test:all
````

## Live Running on render

  [Render](https://currency-converter-node.onrender.com/transactions?userId=123)