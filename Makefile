.PHONY: *

# Default from OrcaBus API
# https://github.com/umccr/orcabus#running-api-locally

VITE_METADATA_URL ?= http://localhost:8100
VITE_WORKFLOW_URL ?= http://localhost:8200
VITE_SEQUENCE_RUN_URL ?= http://localhost:8300
VITE_FILE_URL ?= http://localhost:8400

install:
	@yarn install
	@pre-commit install

generate-openapi-types:
	@yarn run -B openapi-typescript ${VITE_METADATA_URL}/schema/openapi.json -o ./src/api/types/metadata.d.ts
	@yarn run -B openapi-typescript ${VITE_SEQUENCE_RUN_URL}/schema/openapi.json -o ./src/api/types/sequence-run.d.ts
	@yarn run -B openapi-typescript ${VITE_WORKFLOW_URL}/schema/openapi.json -o ./src/api/types/workflow.d.ts
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
