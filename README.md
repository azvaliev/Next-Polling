This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Tech Stack

- Next.JS - for SSR & API route mapping
- React
- TypeScript
- TailWindCSS
- Go - API
- MongoDB

# Getting Started

## Requirements
- [Vercel CLI](https://vercel.com/cli)
- [Go](https://go.dev/doc/install), I am using 1.18.3, older versions not tested

Why the Vercel cli? Well because Go is being used for the API routes, Next JS currently (as of writing v12.2) doesn't support it locally, so vercel command is used for dev server.

## Spinning up the dev server

First, installed dependencies and then we can spin up the dev server:

```bash
npm install
[...]
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API

### Defined routes
- POST /polls - Create a new poll

### Configuring the env
By default, api routes are configured to access a database specified in .env like so
```env
MONGO_URL={MONGO_CONNECTION_STRING}
DEV={true|false}
VERCEL_URL={localhost}
```
MONGO_URL specifies the connection string for mongodb, it will look for a database called `next-polling` and a collection name of `dev` or `prod` based on the value of DEV in the env
VERCEL_URL is used to configure CORS, it is the allowed domain for requests. See index.go for details

### How do the api routes work?

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction).


## Complete file structure guide

- /api - endpoints
- /api-utils - helpers for api routes, database & logger
- /components - components that are not pages on their own
- /context - store context and context related types
- /hooks - store reusable hooks used throughout the project
- /pages - all the client side pages, routing is file structure based
- /public - images, fonts, static assets to be accessed by frontend
- /styles - common component styles where purely using tailwind is not prefferable

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
