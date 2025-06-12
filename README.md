# OrcaUI

This project is the UI representation of our [OrcaBus project](https://github.com/umccr/orcabus).

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

For Run Orcabus API Locally, please refer each Orcabus service repos.

The APIs will run on `localhost` with the following port assignments:

| Microservice         | Service repos                                             | Local Endpoint (default) |
| -------------------- | --------------------------------------------------------- | ------------------------ |
| Metadata Manager     | <https://github.com/OrcaBus/service-metadata-manager>     | <http://localhost:8100>  |
| Workflow Manager     | <https://github.com/OrcaBus/service-workflow-manager>     | <http://localhost:8200>  |
| Sequence Run Manager | <https://github.com/OrcaBus/service-sequence-run-manager> | <http://localhost:8300>  |
| File Manager         | <https://github.com/OrcaBus/service-filemanager>          | <http://localhost:8400>  |

## Deployment

Please the the [README.md](./deploy/README.md) in the `./deploy` directory.
