# Schema ![build status](https://img.shields.io/github/workflow/status/Adamant-im/adamant-schema/Build%20&%20Deploy%20to%20Github%20Pages)

> Swagger schema for ADAMANT Node API

The specification creates a RESTful interface for easily developing and consuming an API by effectively mapping all the resources and operations associated with it.

_https://schema.adamant.im_

## Bootstrap

Install dependencies via `npm`:

```
$ npm install
```

then start dev server:

```shell
$ npm run start
# or
$ npm run start:watch # watches changes in the /specification dir
```

## Commands

To build the schema into a single file `dist/schema.json`, run:

```shell
$ npm run bundle
```

Once the schema is built you can run the server:

```shell
$ npm run start
```

You should now have the Swagger UI running at _http://localhost:3000_.

JSON Schema is available under _http://localhost:3000/schema.json_

## Example

You can use this schema to generate API types for TypeScript:

```shell
$ cd examples/axios

$ npm install

# TS types will be generated in `examples/axios/client` dir
$ npm run openapi:generate
```

## Links

- [OpenAPI](https://swagger.io/specification/)
- [ADAMANT Node API Spec Wiki](https://github.com/Adamant-im/adamant/wiki/API-Specification)
