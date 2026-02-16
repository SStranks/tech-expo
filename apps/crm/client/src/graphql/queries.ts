import { graphql } from './generated/gql';

export const companyByIdQuery = graphql(`
  query CompanyById($input: CompanyInput!) {
    company(input: $input) {
      id
      name
    }
  }
`);
