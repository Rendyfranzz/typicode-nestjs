<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## How To run

```bash
# project install
$ pnpm i

# run db and redis using docker
$ docker compose up -d

# run app
$ pnpm start:dev
```

## Endpoint

### Auth

| No  | Route            | Method | IsLogin | Deskripsi        |
| --- | ---------------- | ------ | ------- | ---------------- |
| 1   | `/auth/register` | POST   | `false` | Register user    |
| 2   | `/auth/login`    | POST   | `true`  | Login Usert      |
| 3   | `/auth/me`       | GET    | `true`  | Get current User |

### Todos

| No  | Route       | Method | IsLogin | Deskripsi          |
| --- | ----------- | ------ | ------- | ------------------ |
| 1   | `/todo`     | POST   | `true`  | Create todo        |
| 2   | `/todo`     | GET    | `true`  | Get todo by user   |
| 3   | `/todo/:id` | GET    | `true`  | Get todo by Id     |
| 4   | `/todo/:id` | PATCH  | `true`  | Change todo status |
| 5   | `/todo/:id` | PUT    | `true`  | Update todo        |
| 6   | `/todo/:id` | DELETE | `true`  | Delete todo        |

## Thunder Client

You can download the thunder client file for test the API [Click Me](https://github.com/Rendyfranzz/typicode-nestjs/blob/main/thunder-collection_dot.json)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
