# OrcaUI

This project is the UI representation of our [OrcaBus project](https://github.com/OrcaBus).

Currently, this project is still in development.

## Development

### API Types Generator

We utilize [OpenAPI Typescript](https://openapi-ts.dev/) to generate TypeScript types from the OpenAPI schema. To generate new types or update existing ones, run the following command:

```sh
make generate-openapi-types
```

## Running Frontend locally

Prerequisite

- Node.js with Yarn
- Docker (for API run locally)
- Active AWS SSO login session (e.g. `aws sso login --profile dev && export AWS_PROFILE=dev`)

```sh
$ node --version
v20.15.0

#  run 'corepack enable' to activate corepack
$ corepack -v
0.20.0
```

Install the dependencies (precommit will be installed)

```sh
$ make install

$ pre-commit --version
pre-commit 3.7.0
```

Start Front-end Development Server

```sh
make start
```

| NOTICE: By default, DEV API will be used for local development, see [makefile](./Makefile) and [start.sh](./start.sh). Default values can be change in Makefile if local Orcabus API is set up for development |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## Run Orcabus API Locally

Microservices are now split into separate repositories, so we will use the dev endpoint instead for local development.

## Vault Page

To get the schema introspection and latest GraphQL API types, run `yarn run mart-codegen-graphql`. Ensure that
`GRAPHQL_SCHEMA_TOKEN` is set to the JWT token to be able to access `https://mart.prod.umccr.org/graphql`

## Deployment

Please the the [README.md](./deploy/README.md) in the `./deploy` directory.
