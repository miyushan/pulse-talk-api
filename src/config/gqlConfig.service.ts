import { Injectable } from '@nestjs/common';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { RequestWithUser } from 'src/types';
import { Context } from 'graphql-ws';
import { TokenService } from 'src/token/token.service';
import { RedisSubscriptionService } from 'src/redis-subscription/redis-subscription.service';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(
    private readonly tokenService: TokenService,
    private readonly redisSubscriptionService: RedisSubscriptionService,
  ) {}

  createGqlOptions(): ApolloDriverConfig {
    return {
      playground: true,
      subscriptions: {
        'graphql-ws': {
          onConnect: async (ctx: Context<Record<string, unknown>, unknown>) => {
            const connectionParams = ctx.connectionParams;
            const token =
              await this.tokenService.extractTokenFromConnectionParams(
                connectionParams,
              );

            if (!token) {
              throw new Error('Token not provided');
            }

            const user = await this.tokenService.validateToken(token);
            if (!user) {
              throw new Error('Invalid token');
            }

            return { user };
          },
        },
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req, res }: { req: RequestWithUser; res: Response }) => {
        const pubSub = this.redisSubscriptionService.getPubSub();

        return {
          req,
          res,
          pubSub,
        };
      },
    };
  }
}
