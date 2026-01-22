import { CurrencyResolver, DateTimeResolver, HexColorCodeResolver, JSONResolver, UUIDResolver } from 'graphql-scalars';

const scalars = {
  Currency: CurrencyResolver,
  DateTime: DateTimeResolver,
  HexColorCode: HexColorCodeResolver,
  JSON: JSONResolver,
  UUID: UUIDResolver,
};

export default scalars;
