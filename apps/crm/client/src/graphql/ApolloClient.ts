import { ApolloClient, InMemoryCache } from '@apollo/client';

const { PUBLIC_URL } = process.env;

export default new ApolloClient({
  cache: new InMemoryCache(),
  uri: `http://${PUBLIC_URL}/graphql`,
});
