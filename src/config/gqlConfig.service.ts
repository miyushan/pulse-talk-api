import { Injectable } from '@nestjs/common';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { RequestWithUser } from 'src/types';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  createGqlOptions(): ApolloDriverConfig {
    return {
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req, res }: { req: RequestWithUser; res: Response }) => ({
        req,
        res,
      }),
    };
  }
}
