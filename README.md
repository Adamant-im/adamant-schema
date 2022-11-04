# Bootstrap

```shell
$ npm install
$ npm run start
# or
$ npm run start:watch # watches changes in the /specification dir
```

## Commands

```shell
# Bundle YAML files into a single file `dist/schema.json`
$ npm run bundle
```

```shell
# Run Swagger UI
$ npm run start
```

- Swagger UI: http://localhost:3000
- Schema JSON: http://localhost:3000/schema.json

# Examples

## Axios TypeScript template

```shell
$ cd examples/axios
$ npm install

# TS types will be generated in `examples/axios/client` dir
$ npm run openapi:generate
```

# Links

- [OpenAPI](https://swagger.io/specification/)
- [ADAMANT Node API Spec Wiki](https://github.com/Adamant-im/adamant/wiki/API-Specification)
