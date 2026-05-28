import type { CodegenConfig } from '@graphql-codegen/cli';

import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const mergedSchema = import.meta.resolve('@apps/crm-shared/graphql/schema');

// NOTE:  'contextType' and 'mappers' paths starts from location of the output file of the generated types.
const config: CodegenConfig = {
  generates: {
    './src/graphql/generated/graphql.gen.ts': {
      config: {
        contextType: '../../graphql/context.ts#GraphqlContext',
        enumValues: {
          BusinessType: '../../models/domain/company/company.types.ts#BusinessType',
          CompanyRole: '../../models/domain/user/profile/profile.types.ts#CompanyRoles',
          CompanySize: '../../models/domain/company/company.types.ts#CompanySize',
          ContactStage: '../../models/domain/contact/contact.types.ts#ContactStage',
          QuoteStage: '../../models/domain/quote/quote.types.ts#QuoteStage',
        },
        mappers: {
          // NOTE: Key = Schema Type name. Value = What the Parent object is.
          CalendarEvent: '../../models/domain/calendar/event/event.dto.ts#CalendarEventDTO',
          Company: '../../models/domain/company/company.dto.ts#CompanyDTO',
          CompanyDetailed: '../../models/domain/company/company.dto.ts#CompanyDTO',
          Contact: '../../models/domain/contact/contact.dto.ts#ContactDTO',
          ContactDetailed: '../../models/domain/contact/contact.dto.ts#ContactDTO',
          Country: '../../models/domain/country/country.dto.ts#CountryDTO',
          Quote: '../../models/domain/quote/quote.dto.ts#QuoteDTO',
          QuoteDetailed: '../../models/domain/quote/quote.dto.ts#QuoteDTO',
          TimeZone: '../../models/domain/timezone/timezone.dto.ts#TimeZoneDTO',
          UserProfile: '../../models/domain/user/profile/profile.dto.ts#UserProfileDTO',
        },
        scalars: {
          UUID: '@apps/crm-shared#UUID',
        },
        skipTypename: true,
        useIndexSignature: true,
        useTypeImports: true,
      },
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
  overwrite: true,
  schema: path.relative(__dirname, url.fileURLToPath(mergedSchema)),
};

export default config;
