# OrcaUI (dev) 🚧

This project is the UI representation of our [OrcaBus project](https://github.com/umccr/orcabus).

Currently, this project is still in development.

## Development

### API Types Generator

We utilize [OpenAPI Typescript](https://openapi-ts.dev/) to generate TypeScript types from the OpenAPI schema. To generate new types or update existing ones, run the following command:

```sh
make generate-openapi-types
```

## Running locally

Prerequisite

```sh
pre-commit --version
pre-commit 3.7.0

node --version
v20.9.0

#  run 'corepack enable' to activate corepack
corepack -v
0.20.0
```

Install the dependencies

```sh
make install
```

Start Development Server

```sh
yarn dev
```

## Deployment

Please the the [README.md](./deploy/README.md) in the `./deploy` directory.
