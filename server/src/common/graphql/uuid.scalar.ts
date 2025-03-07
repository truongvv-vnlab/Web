import { GraphQLScalarType, Kind } from 'graphql';
import { v4 as uuidv4, validate as validateUUID } from 'uuid';

export const UUIDScalar = new GraphQLScalarType({
  name: 'UUID',
  description: 'A UUID scalar type',
  serialize(value: unknown): string {
    if (typeof value !== 'string' || !validateUUID(value)) {
      throw new Error('UUID must be a valid string');
    }
    return value;
  },
  parseValue(value: unknown): string {
    if (typeof value !== 'string' || !validateUUID(value)) {
      throw new Error('Invalid UUID format');
    }
    return value;
  },
  parseLiteral(ast): string | null {
    if (ast.kind === Kind.STRING && validateUUID(ast.value)) {
      return ast.value;
    }
    return null;
  },
});
