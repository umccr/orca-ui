/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/api/v1/payload/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["apiV1PayloadList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/payload/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["apiV1PayloadRetrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflow/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["apiV1WorkflowList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflow/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["apiV1WorkflowRetrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflowrun/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["apiV1WorkflowrunList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflowrun/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["apiV1WorkflowrunRetrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflowrun/{workflowrunId}/library/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["apiV1WorkflowrunLibraryList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflowrun/{workflowrunId}/library/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["apiV1WorkflowrunLibraryRetrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflowrun/{workflowrunId}/state/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["apiV1WorkflowrunStateList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workflowrun/{workflowrunId}/state/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["apiV1WorkflowrunStateRetrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        LibraryModel: {
            orcabusId: string;
            libraryId: string;
        };
        PaginatedLibraryModelList: {
            links: {
                /**
                 * Format: uri
                 * @example http://api.example.org/accounts/?page=4
                 */
                next?: string | null;
                /**
                 * Format: uri
                 * @example http://api.example.org/accounts/?page=2
                 */
                previous?: string | null;
            };
            pagination: {
                count?: number;
                page?: number;
                rowsPerPage?: number;
            };
            results: components["schemas"]["LibraryModel"][];
        };
        PaginatedPayloadModelList: {
            links: {
                /**
                 * Format: uri
                 * @example http://api.example.org/accounts/?page=4
                 */
                next?: string | null;
                /**
                 * Format: uri
                 * @example http://api.example.org/accounts/?page=2
                 */
                previous?: string | null;
            };
            pagination: {
                count?: number;
                page?: number;
                rowsPerPage?: number;
            };
            results: components["schemas"]["PayloadModel"][];
        };
        PaginatedStateModelList: {
            links: {
                /**
                 * Format: uri
                 * @example http://api.example.org/accounts/?page=4
                 */
                next?: string | null;
                /**
                 * Format: uri
                 * @example http://api.example.org/accounts/?page=2
                 */
                previous?: string | null;
            };
            pagination: {
                count?: number;
                page?: number;
                rowsPerPage?: number;
            };
            results: components["schemas"]["StateModel"][];
        };
        PaginatedWorkflowModelList: {
            links: {
                /**
                 * Format: uri
                 * @example http://api.example.org/accounts/?page=4
                 */
                next?: string | null;
                /**
                 * Format: uri
                 * @example http://api.example.org/accounts/?page=2
                 */
                previous?: string | null;
            };
            pagination: {
                count?: number;
                page?: number;
                rowsPerPage?: number;
            };
            results: components["schemas"]["WorkflowModel"][];
        };
        PaginatedWorkflowRunModelList: {
            links: {
                /**
                 * Format: uri
                 * @example http://api.example.org/accounts/?page=4
                 */
                next?: string | null;
                /**
                 * Format: uri
                 * @example http://api.example.org/accounts/?page=2
                 */
                previous?: string | null;
            };
            pagination: {
                count?: number;
                page?: number;
                rowsPerPage?: number;
            };
            results: components["schemas"]["WorkflowRunModel"][];
        };
        PayloadModel: {
            readonly id: number;
            payloadRefId: string;
            version: string;
            data: unknown;
        };
        StateModel: {
            readonly id: number;
            status: string;
            /** Format: date-time */
            timestamp: string;
            comment?: string | null;
            workflowRun: number;
            payload?: number | null;
        };
        WorkflowModel: {
            readonly id: number;
            workflowName: string;
            workflowVersion: string;
            executionEngine: string;
            executionEnginePipelineId: string;
            approvalState: string;
        };
        WorkflowRunModel: {
            readonly id: number;
            portalRunId: string;
            executionId?: string | null;
            workflowRunName?: string | null;
            comment?: string | null;
            workflow?: number | null;
            readonly libraries: string[];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    apiV1PayloadList: {
        parameters: {
            query?: {
                /** @description Which field to use when ordering the results. */
                ordering?: string;
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description Number of results to return per page. */
                rowsPerPage?: number;
                /** @description A search term. */
                search?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedPayloadModelList"];
                };
            };
        };
    };
    apiV1PayloadRetrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this payload. */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PayloadModel"];
                };
            };
        };
    };
    apiV1WorkflowList: {
        parameters: {
            query?: {
                /** @description Which field to use when ordering the results. */
                ordering?: string;
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description Number of results to return per page. */
                rowsPerPage?: number;
                /** @description A search term. */
                search?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedWorkflowModelList"];
                };
            };
        };
    };
    apiV1WorkflowRetrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this workflow. */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkflowModel"];
                };
            };
        };
    };
    apiV1WorkflowrunList: {
        parameters: {
            query?: {
                /** @description Which field to use when ordering the results. */
                ordering?: string;
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description Number of results to return per page. */
                rowsPerPage?: number;
                /** @description A search term. */
                search?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedWorkflowRunModelList"];
                };
            };
        };
    };
    apiV1WorkflowrunRetrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this workflow run. */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkflowRunModel"];
                };
            };
        };
    };
    apiV1WorkflowrunLibraryList: {
        parameters: {
            query?: {
                /** @description Which field to use when ordering the results. */
                ordering?: string;
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description Number of results to return per page. */
                rowsPerPage?: number;
                /** @description A search term. */
                search?: string;
            };
            header?: never;
            path: {
                workflowrunId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedLibraryModelList"];
                };
            };
        };
    };
    apiV1WorkflowrunLibraryRetrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                workflowrunId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LibraryModel"];
                };
            };
        };
    };
    apiV1WorkflowrunStateList: {
        parameters: {
            query?: {
                /** @description Which field to use when ordering the results. */
                ordering?: string;
                /** @description A page number within the paginated result set. */
                page?: number;
                /** @description Number of results to return per page. */
                rowsPerPage?: number;
                /** @description A search term. */
                search?: string;
            };
            header?: never;
            path: {
                workflowrunId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginatedStateModelList"];
                };
            };
        };
    };
    apiV1WorkflowrunStateRetrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                workflowrunId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StateModel"];
                };
            };
        };
    };
}