import { gql } from '@apollo/client';

import ApolloClient from './ApolloClient';

export async function testQuery() {
  const query = gql`
    query HelloWorld {
      helloWorld
    }
  `;

  const { data } = await ApolloClient.query({ query });
  return data;
}
