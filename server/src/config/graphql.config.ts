import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GraphqlConfig implements GqlOptionsFactory<ApolloDriverConfig> {
  constructor(private configService: ConfigService) {}
  async createGqlOptions(): Promise<Omit<ApolloDriverConfig, 'driver'>> {
    return {
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: this.configService.get<boolean>('GRAPHQL_PLAYGROUND', true),
      sortSchema: this.configService.get<boolean>('GRAPHQL_SORT_SCHEMA', true),
      debug: this.configService.get<boolean>('GRAPHQL_DEBUG', true),
      context: ({ req }) => ({ req }),
    };
  }
}
