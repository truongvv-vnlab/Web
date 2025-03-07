import { GraphQLScalarType, Kind } from 'graphql';

export const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'ISO 8601 DateTime Scalar Type',

  serialize(value: unknown): string {
    if (!(value instanceof Date)) {
      throw new Error('Giá trị không phải là một Date hợp lệ');
    }
    return value.toISOString(); // Convert Date -> String
  },

  parseValue(value: unknown): Date {
    if (typeof value !== 'string') {
      throw new Error('DateTime phải là chuỗi ISO 8601');
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error('Chuỗi không phải là một DateTime hợp lệ');
    }
    return date; // Convert String -> Date
  },

  parseLiteral(ast): Date | null {
    if (ast.kind === Kind.STRING) {
      const date = new Date(ast.value);
      if (isNaN(date.getTime())) return null;
      return date;
    }
    return null;
  },
});
