install:
	@yarn install
	@pre-commit install

generate-openapi-types:
	@yarn run -B openapi-typescript http://localhost:8000/schema -o ./src/api/types/metadata.d.ts
