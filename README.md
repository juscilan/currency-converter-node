# Node.js/NestJS Currency Convert Challenge

## Features
- Real-time currency conversion
- Transaction history tracking
- REST API endpoints
- Automated documentation
- Input validation
- Comprehensive testing

## Technologies
- **Framework**: NestJS
- **ORM**: TypeORM
- **Database**: SQLite
- **API Docs**: Swagger UI
- **Testing**: Jest, Supertest

## Tech Stack
- **Backend**: NestJS
- **Database**: TypeORM + SQLite
- **Docs**: Swagger UI
- **Testing**: Jest + Supertest

## Installation
1. Clone repository:
Make sure that you are using NodeJS 20 version or latest
```bash
git clone https://github.com/juscilan/currency-converter-node.git
cd currency-converter-node
```
2. Install the dependencies:
````
npm install
````

---

### Create a .env file on app root and add the currencyapi API key 
````
CURRENCY_API_KEY=[CURRENCY_API_KEY_VALUE]
````
````
npm run start:dev
````

### Manual testing
#### Install [RestClient](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) on your Visual Studio Code
##### (Local) navigate to folder ./test/test.transactions.local.http and test it.
##### (Online) navigate to folder ./test/test.transactions.remote.http and test it.

### Automatic Testing (unit tests and e2e tests)
````
npm run test:all
````

## Live Running on [Render](https://currency-converter-node.onrender.com/transactions?userId=123)
## [Swagger Live running](https://currency-converter-node.onrender.com/api)

