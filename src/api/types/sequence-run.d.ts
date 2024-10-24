/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/api/v1/sequence/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["apiV1SequenceList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sequence/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["apiV1SequenceRetrieve"];
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
        PaginatedSequenceList: {
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
            results: components["schemas"]["Sequence"][];
        };
        Sequence: {
            readonly id: number;
            instrumentRunId: string;
            runVolumeName: string;
            runFolderPath: string;
            runDataUri: string;
            status: components["schemas"]["StatusEnum"];
            /** Format: date-time */
            startTime: string;
            /** Format: date-time */
            endTime?: string | null;
            reagentBarcode?: string | null;
            flowcellBarcode?: string | null;
            sampleSheetName?: string | null;
            sequenceRunId?: string | null;
            sequenceRunName?: string | null;
        };
        /**
         * @description * `STARTED` - Started
         *     * `FAILED` - Failed
         *     * `SUCCEEDED` - Succeeded
         *     * `ABORTED` - Aborted
         * @enum {string}
         */
        StatusEnum: "STARTED" | "FAILED" | "SUCCEEDED" | "ABORTED";
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    apiV1SequenceList: {
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
                    "application/json": components["schemas"]["PaginatedSequenceList"];
                };
            };
        };
    };
    apiV1SequenceRetrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this sequence. */
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
                    "application/json": components["schemas"]["Sequence"];
                };
            };
        };
    };
}
