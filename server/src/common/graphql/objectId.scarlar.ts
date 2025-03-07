import { GraphQLScalarType, Kind } from 'graphql';
import { ObjectId } from 'mongodb';

export const ObjectIdScalar = new GraphQLScalarType({
  name: 'ObjectId',
  description: 'MongoDB ObjectId Scalar Type',
  serialize(value: unknown): string {
    if (!(value instanceof ObjectId)) {
      throw new Error('Giá trị không phải là ObjectId hợp lệ');
    }
    return value.toHexString();
  },
  parseValue(value: unknown): ObjectId {
    if (typeof value !== 'string') {
      throw new Error('ObjectId phải là chuỗi');
    }
    return new ObjectId(value);
  },
  parseLiteral(ast): ObjectId | null {
    if (ast.kind === Kind.STRING) {
      return new ObjectId(ast.value);
    }
    return null;
  },
});
