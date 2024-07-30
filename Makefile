.PHONY: *

# Default from OrcaBus API
# https://github.com/umccr/orcabus#running-api-locally

VITE_FILE_MANAGER_URL ?= http://localhost:8000
VITE_METADATA_MANAGER_URL ?= http://localhost:8100
VITE_SEQUENCE_RUN_MANAGER_URL ?= http://localhost:8200
VITE_WORKFLOW_MANAGER_URL ?= http://localhost:8300

install:
	@yarn install
	@pre-commit install

generate-openapi-types:
	@yarn run -B openapi-typescript ${VITE_METADATA_MANAGER_URL}/schema/openapi.json -o ./src/api/types/metadata.d.ts
	@yarn run -B openapi-typescript ${VITE_SEQUENCE_RUN_MANAGER_URL}/schema/openapi.json -o ./src/api/types/sequence-run.d.ts
	@yarn run -B openapi-typescript ${VITE_WORKFLOW_MANAGER_URL}/schema/openapi.json -o ./src/api/types/workflow.d.ts

start:
	@yarn run start
