export type Filter = {
  key: string;
  operator: string;
  value: string;
};

type GraphQLTypeRef = {
  kind: string;
  name: string | null;
  ofType: GraphQLTypeRef | null;
};

type GraphQLInputField = {
  name: string;
  description?: string;
  type: GraphQLTypeRef;
  defaultValue?: string | null;
  isDeprecated?: boolean;
  deprecationReason?: string | null;
};

type GraphQLInputObject = {
  kind: 'INPUT_OBJECT';
  name: string;
  description?: string;
  inputFields: GraphQLInputField[];
};

const scalarTypeMap: Record<string, string> = {
  String: 'string',
  Int: 'number',
  Float: 'number',
  Boolean: 'boolean',
  ID: 'string',
  Datetime: 'timestamp',
  Date: 'date',
  Cursor: 'string',
};

function unwrapType(type: GraphQLTypeRef): string | null {
  // Recursively unwraps type to find the innermost named type
  if (type.name) return type.name;
  if (type.ofType) return unwrapType(type.ofType);
  return null;
}

export function convertInputObjectToSchema(
  inputObject: GraphQLInputObject
): Record<string, string> {
  if (!inputObject || !Array.isArray(inputObject.inputFields)) {
    throw new Error('Invalid input object');
  }

  const result: Record<string, string> = {};

  for (const field of inputObject.inputFields) {
    const typeName = unwrapType(field.type);
    result[field.name] = scalarTypeMap[typeName ?? ''] || 'unknown';
  }

  return result;
}
