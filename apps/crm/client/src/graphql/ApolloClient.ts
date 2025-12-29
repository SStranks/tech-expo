import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

import { ENV } from '@Config/env';

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: `http://${ENV.publicUrl}/graphql` }),
});
