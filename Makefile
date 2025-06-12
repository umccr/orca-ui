.PHONY: *

# Default from OrcaBus API
# https://github.com/umccr/orcabus#running-api-locally

# Set default values if not already set (default to dev)
VITE_METADATA_URL ?= https://metadata.dev.umccr.org
VITE_WORKFLOW_URL ?= https://workflow.dev.umccr.org
VITE_SEQUENCE_RUN_URL ?= https://sequence.dev.umccr.org
VITE_FILE_URL ?= https://file.dev.umccr.org
VITE_SSCHECK_URL ?= https://sscheck-orcabus.dev.umccr.org

# Set local development values when local Orcabus API is set up for development
# VITE_METADATA_URL ?= http://localhost:8100
# VITE_WORKFLOW_URL ?= http://localhost:8200
#VITE_SEQUENCE_RUN_URL ?= http://localhost:8300
# VITE_FILE_URL ?= http://localhost:8400
# VITE_SSCHECK_URL ?= NONE


# Export the variables
export VITE_METADATA_URL
export VITE_WORKFLOW_URL
export VITE_FILE_URL
export VITE_SSCHECK_URL
export VITE_SEQUENCE_RUN_URL

install:
	@yarn install
	@pre-commit install

generate-openapi-types:
	@echo "Generating Metadata OpenAPI types from ${VITE_METADATA_URL}..."
	@yarn run -B openapi-typescript ${VITE_METADATA_URL}/schema/openapi.json -o ./src/api/types/metadata.d.ts
	@echo "Generating Sequence Run OpenAPI types from ${VITE_SEQUENCE_RUN_URL}..."
	@yarn run -B openapi-typescript ${VITE_SEQUENCE_RUN_URL}/schema/openapi.json -o ./src/api/types/sequence-run.d.ts
	@echo "Generating Workflow OpenAPI types from ${VITE_WORKFLOW_URL}..."
	@yarn run -B openapi-typescript ${VITE_WORKFLOW_URL}/schema/openapi.json -o ./src/api/types/workflow.d.ts
	@echo "Generating File OpenAPI types from ${VITE_FILE_URL}..."
	@yarn run -B openapi-typescript ${VITE_FILE_URL}/schema/openapi.json -o ./src/api/types/file.d.ts

start: generate-openapi-types
	@yarn run start

deploy-dev:
	@yarn build
	@aws s3 cp ./dist s3://orcaui-cloudfront-843407916570/ --recursive
	@aws lambda invoke \
    --function-name CodeBuildEnvConfigLambdaBeta \
    response.json

storybook:
	@yarn run storybook
