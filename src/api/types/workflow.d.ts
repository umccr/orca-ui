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
        get: operations["api_v1_payload_list"];
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
        get: operations["api_v1_payload_retrieve"];
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
        get: operations["api_v1_workflow_list"];
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
        get: operations["api_v1_workflow_retrieve"];
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
        get: operations["api_v1_workflowrun_list"];
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
        get: operations["api_v1_workflowrun_retrieve"];
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
            status: string;
            /** Format: date-time */
            timestamp: string;
            executionId?: string | null;
            workflowRunName?: string | null;
            comment?: string | null;
            workflow?: number | null;
            payload?: number | null;
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
    api_v1_payload_list: {
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
    api_v1_payload_retrieve: {
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
    api_v1_workflow_list: {
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
    api_v1_workflow_retrieve: {
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
    api_v1_workflowrun_list: {
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
    api_v1_workflowrun_retrieve: {
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
}
