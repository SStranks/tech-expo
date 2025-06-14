import { graphql } from './generated/gql';

export const query = graphql(`
  query CompanyById($id: UUID!) {
    company(id: $id) {
      id
    }
  }
`);
