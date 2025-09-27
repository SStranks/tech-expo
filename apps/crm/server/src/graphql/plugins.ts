import { BaseContext, GraphQLRequestContext } from '@apollo/server';

import { pinoLogger } from '#Lib/index.js';

type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

const graphqlLogger = {
  async requestDidStart(_requestContext: GraphQLRequestContext<BaseContext>) {
    return {
      async didEncounterErrors<TContext extends BaseContext>(
        requestContext: WithRequired<GraphQLRequestContext<TContext>, 'errors'>
      ): Promise<void> {
        const { errors } = requestContext;
        const serverErrors = errors.filter((error) => {
          console.log(error);
          return error.extensions?.code === 'INTERNAL_SERVER_ERROR';
        });

        if (serverErrors.length > 0) pinoLogger.server.error(errors, 'GraphQL Error');
      },
    };
  },
};

export { graphqlLogger };
