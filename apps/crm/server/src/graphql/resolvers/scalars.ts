import type { Resolvers } from '#Types/graphql/graphql.gen.js';

import { DateTimeResolver, HexColorCodeResolver, JSONResolver, UUIDResolver } from 'graphql-scalars';

const companyResolver: Resolvers = {
  DateTime: DateTimeResolver,
  HexColorCode: HexColorCodeResolver,
  JSON: JSONResolver,
  UUID: UUIDResolver,
};

export default companyResolver;
