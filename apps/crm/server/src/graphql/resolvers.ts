import { GraphQLError } from 'graphql';

export const resolvers = {
  Query: {
    greeting: () => {
      throw new GraphQLError('Boob');
      // throw new GraphQLError('Boob', { extensions: { code: 'Moob' } });
    },
  },
};
