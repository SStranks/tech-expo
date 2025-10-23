import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const { PUBLIC_URL } = process.env;

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: `http://${PUBLIC_URL}/graphql` }),
});
