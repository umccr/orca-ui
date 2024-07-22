/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/library/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["library_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/library/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["library_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/library/{id}/full/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["library_full_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/library/full/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["library_full_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/schema/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description OpenApi3 schema for this API. Format can be selected via content negotiation.
         *
         *     - YAML: application/vnd.oai.openapi
         *     - JSON: application/vnd.oai.openapi+json */
        get: operations["schema_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/specimen/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["specimen_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/specimen/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["specimen_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subject/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["subject_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subject/{id}/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["subject_retrieve"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subject/{id}/full/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["subject_full_list_2"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subject/full/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["subject_full_list"];
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
        /** @enum {unknown} */
        BlankEnum: "";
        Library: {
            readonly id: number;
            internal_id?: string | null;
            phenotype?: (components["schemas"]["PhenotypeEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"]) | null;
            workflow?: (components["schemas"]["WorkflowEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"]) | null;
            quality?: (components["schemas"]["QualityEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"]) | null;
            type?: (components["schemas"]["TypeEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"]) | null;
            assay?: string | null;
            /** Format: double */
            coverage?: number | null;
            specimen?: number | null;
        };
        /** @description This is a full Library serializer which include the specimen and subject models */
        LibraryFull: {
            readonly id: number;
            specimen: components["schemas"]["SpecimenSubject"];
            internal_id?: string | null;
            phenotype?: (components["schemas"]["PhenotypeEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"]) | null;
            workflow?: (components["schemas"]["WorkflowEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"]) | null;
            quality?: (components["schemas"]["QualityEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"]) | null;
            type?: (components["schemas"]["TypeEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"]) | null;
            assay?: string | null;
            /** Format: double */
            coverage?: number | null;
        };
        /** @enum {unknown} */
        NullEnum: null;
        PaginatedLibraryFullList: {
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
            results: components["schemas"]["LibraryFull"][];
        };
        PaginatedLibraryList: {
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
            results: components["schemas"]["Library"][];
        };
        PaginatedSpecimenList: {
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
            results: components["schemas"]["Specimen"][];
        };
        PaginatedSubjectFullList: {
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
            results: components["schemas"]["SubjectFull"][];
        };
        PaginatedSubjectList: {
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
            results: components["schemas"]["Subject"][];
        };
        /**
         * @description * `normal` - Normal
         *     * `tumor` - Tumor
         *     * `negative-control` - Negative Control
         * @enum {string}
         */
        PhenotypeEnum: "normal" | "tumor" | "negative-control";
        /**
         * @description * `very-poor` - VeryPoor
         *     * `poor` - Poor
         *     * `good` - Good
         *     * `borderline` - Borderline
         * @enum {string}
         */
        QualityEnum: "very-poor" | "poor" | "good" | "borderline";
        /**
         * @description * `ascites` - Ascites
         *     * `blood` - Blood
         *     * `bone-marrow` - BoneMarrow
         *     * `buccal` - Buccal
         *     * `cell-line` - Cell_line
         *     * `cfDNA` - Cfdna
         *     * `cyst-fluid` - Cyst Fluid
         *     * `DNA` - Dna
         *     * `eyebrow-hair` - Eyebrow Hair
         *     * `FFPE` - Ffpe
         *     * `FNA` - Fna
         *     * `OCT` - Oct
         *     * `organoid` - Organoid
         *     * `PDX-tissue` - Pdx Tissue
         *     * `plasma-serum` - Plasma Serum
         *     * `RNA` - Rna
         *     * `tissue` - Tissue
         *     * `skin` - Skin
         *     * `water` - Water
         * @enum {string}
         */
        SourceEnum: "ascites" | "blood" | "bone-marrow" | "buccal" | "cell-line" | "cfDNA" | "cyst-fluid" | "DNA" | "eyebrow-hair" | "FFPE" | "FNA" | "OCT" | "organoid" | "PDX-tissue" | "plasma-serum" | "RNA" | "tissue" | "skin" | "water";
        Specimen: {
            readonly id: number;
            internal_id?: string | null;
            source?: (components["schemas"]["SourceEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"]) | null;
            subject?: number | null;
        };
        /** @description This is a full Specimen serializer which include the library model */
        SpecimenLibrary: {
            readonly id: number;
            library_set: components["schemas"]["Library"][];
            internal_id?: string | null;
            source?: (components["schemas"]["SourceEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"]) | null;
            subject?: number | null;
        };
        /** @description This is a full Specimen serializer which include the subject model */
        SpecimenSubject: {
            readonly id: number;
            subject: components["schemas"]["Subject"];
            internal_id?: string | null;
            source?: (components["schemas"]["SourceEnum"] | components["schemas"]["BlankEnum"] | components["schemas"]["NullEnum"]) | null;
        };
        Subject: {
            readonly id: number;
            internal_id?: string | null;
        };
        /** @description This is a full Subject serializer which include all the children's (specimen and library) related models */
        SubjectFull: {
            readonly id: number;
            specimen_set: components["schemas"]["SpecimenLibrary"][];
            internal_id?: string | null;
        };
        /**
         * @description * `10X` - Ten X
         *     * `BiModal` - Bimodal
         *     * `ctDNA` - Ct Dna
         *     * `ctTSO` - Ct Tso
         *     * `exome` - Exome
         *     * `MeDIP` - Me Dip
         *     * `Metagenm` - Metagenm
         *     * `MethylSeq` - Methyl Seq
         *     * `TSO-DNA` - TSO_DNA
         *     * `TSO-RNA` - TSO_RNA
         *     * `WGS` - Wgs
         *     * `WTS` - Wts
         *     * `other` - Other
         * @enum {string}
         */
        TypeEnum: "10X" | "BiModal" | "ctDNA" | "ctTSO" | "exome" | "MeDIP" | "Metagenm" | "MethylSeq" | "TSO-DNA" | "TSO-RNA" | "WGS" | "WTS" | "other";
        /**
         * @description * `clinical` - Clinical
         *     * `research` - Research
         *     * `qc` - Qc
         *     * `control` - Control
         *     * `bcl` - Bcl
         *     * `manual` - Manual
         * @enum {string}
         */
        WorkflowEnum: "clinical" | "research" | "qc" | "control" | "bcl" | "manual";
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    library_list: {
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
                    "application/json": components["schemas"]["PaginatedLibraryList"];
                };
            };
        };
    };
    library_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this library. */
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
                    "application/json": components["schemas"]["Library"];
                };
            };
        };
    };
    library_full_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this library. */
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
                    "application/json": components["schemas"]["LibraryFull"];
                };
            };
        };
    };
    library_full_list: {
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
                    "application/json": components["schemas"]["PaginatedLibraryFullList"];
                };
            };
        };
    };
    schema_retrieve: {
        parameters: {
            query?: {
                format?: "json" | "yaml";
                lang?: "af" | "ar" | "ar-dz" | "ast" | "az" | "be" | "bg" | "bn" | "br" | "bs" | "ca" | "ckb" | "cs" | "cy" | "da" | "de" | "dsb" | "el" | "en" | "en-au" | "en-gb" | "eo" | "es" | "es-ar" | "es-co" | "es-mx" | "es-ni" | "es-ve" | "et" | "eu" | "fa" | "fi" | "fr" | "fy" | "ga" | "gd" | "gl" | "he" | "hi" | "hr" | "hsb" | "hu" | "hy" | "ia" | "id" | "ig" | "io" | "is" | "it" | "ja" | "ka" | "kab" | "kk" | "km" | "kn" | "ko" | "ky" | "lb" | "lt" | "lv" | "mk" | "ml" | "mn" | "mr" | "ms" | "my" | "nb" | "ne" | "nl" | "nn" | "os" | "pa" | "pl" | "pt" | "pt-br" | "ro" | "ru" | "sk" | "sl" | "sq" | "sr" | "sr-latn" | "sv" | "sw" | "ta" | "te" | "tg" | "th" | "tk" | "tr" | "tt" | "udm" | "ug" | "uk" | "ur" | "uz" | "vi" | "zh-hans" | "zh-hant";
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
                    "application/vnd.oai.openapi": {
                        [key: string]: unknown;
                    };
                    "application/yaml": {
                        [key: string]: unknown;
                    };
                    "application/vnd.oai.openapi+json": {
                        [key: string]: unknown;
                    };
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    specimen_list: {
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
                    "application/json": components["schemas"]["PaginatedSpecimenList"];
                };
            };
        };
    };
    specimen_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this specimen. */
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
                    "application/json": components["schemas"]["Specimen"];
                };
            };
        };
    };
    subject_list: {
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
                    "application/json": components["schemas"]["PaginatedSubjectList"];
                };
            };
        };
    };
    subject_retrieve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description A unique integer value identifying this subject. */
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
                    "application/json": components["schemas"]["Subject"];
                };
            };
        };
    };
    subject_full_list_2: {
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
                /** @description A unique integer value identifying this subject. */
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
                    "application/json": components["schemas"]["PaginatedSubjectFullList"];
                };
            };
        };
    };
    subject_full_list: {
        parameters: {
            query?: {
                /** @description Filter the subjects that contain this particular internal_id in the Library model. */
                library_internal_id?: string;
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
                    "application/json": components["schemas"]["PaginatedSubjectFullList"];
                };
            };
        };
    };
}