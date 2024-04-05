# URL shortener api

The purpose of this project is for learning NEST.js

## Tech stack

- Nest.js
- Prisma
- Redis
- Postgres

## How to run this project

1. Install dependencies

```bash
npm i
```

2. Start Docker for Postgres and Redis

```bash
npm run docker:start
```

3. Migrate Database

```bash
npm run db:migrate:dev

```

4. Start the project

```bash
npm run start:dev
```
