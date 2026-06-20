# Schema ![build status](https://img.shields.io/github/actions/workflow/status/Adamant-im/adamant-schema/github-pages.yaml?branch=master)

> OpenAPI 3.0 specification for the ADAMANT Node API, with interactive Swagger UI.

[ADAMANT](https://adamant.im) is a decentralized messenger built on its own blockchain. This specification defines the RESTful interface for interacting with an ADAMANT Node — covering accounts, transactions, chats, delegates, blocks, and more.

**Live schema:** [schema.adamant.im](https://schema.adamant.im)

## Getting started

Install dependencies:

```shell
npm install
```

Bundle and start the Swagger UI at http://localhost:3000:

```shell
npm run start
# or, to watch for changes in specification/:
npm run start:watch
```

## Commands

| Command | Description |
|---|---|
| `npm run bundle` | Bundle `specification/` into `dist/schema.json` |
| `npm run start` | Bundle and start Swagger UI at http://localhost:3000 |
| `npm run start:watch` | Watch `specification/` for changes and auto-rebuild |

## Example: generate TypeScript types

```shell
cd examples/axios
npm install
npm run openapi:generate  # output: examples/axios/client/
```

## Links

- [ADAMANT](https://adamant.im) — project website
- [ADAMANT Node](https://github.com/Adamant-im/adamant) — the blockchain node implementation
- [AIPs](https://github.com/Adamant-im/AIPs) — ADAMANT Improvement Proposals
- [ADAMANT Node API Docs](https://docs.adamant.im) — API reference
- [OpenAPI Specification](https://swagger.io/specification/) — OpenAPI 3.0 standard
