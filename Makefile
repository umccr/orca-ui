install:
	@yarn install
	@pre-commit install


type-openapi-generator:
	@yarn run -B openapi-typescript http://localhost:8000/schema -o ./src/api/types/metadata.d.ts
