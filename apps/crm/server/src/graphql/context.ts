import type { UserRoles, UUID } from '@apps/crm-shared';
import type { Request, Response } from 'express';

import type {
  CompanyDataLoader,
  ContactDataLoader,
  CountryDataLoader,
  QuoteDataLoader,
  TimezoneDataLoader,
  UserProfileDataLoader,
} from './loaders.ts';

import { GraphQLError } from 'graphql';

import { postgresDB } from '#Config/dbPostgres.js';
import { redisClient } from '#Config/dbRedis.js';
import { secrets } from '#Config/secrets.js';
import { PostgresCalendarRepository } from '#Models/domain/calendar/calendar.repository.postgres.js';
import { PostgresCompanyRepository } from '#Models/domain/company/company.repository.postgres.js';
import { PostgresContactRepository } from '#Models/domain/contact/contact.repository.postgres.js';
import { PostgresCountryRepository } from '#Models/domain/country/country.repository.postgres.js';
import { PostgresPipelineRepository } from '#Models/domain/pipeline/pipeline.repository.postgres.js';
import { PostgresQuoteRepository } from '#Models/domain/quote/quote.postgres.repository.js';
import { PostgresUserRepository } from '#Models/domain/user/user.repository.postgres.js';
import { PostgresCalendarReadModel } from '#Models/query/calendar/calendar.read-model.postgres.js';
import { PostgresCompanyReadModel } from '#Models/query/company/companies.read-model.postgres.js';
import { PostgresContactReadModel } from '#Models/query/contact/contacts.read-model.postgres.js';
import { PostgresCountryReadModel } from '#Models/query/country/countries.read-model.postgres.js';
import { PostgresPipelineReadModel } from '#Models/query/pipeline/pipeline.read-model.postgres.js';
import { PostgresQuoteReadModel } from '#Models/query/quote/quotes.read-model.postgres.js';
import { PostgresTimezoneReadModel } from '#Models/query/timezone/timezone.postgres.js';
import { PostgresUserReadModel } from '#Models/query/user/users.read-model.postgres.js';
import { CalendarService } from '#Services/calendar.service.js';
import { CompanyService } from '#Services/company.service.js';
import { ContactService } from '#Services/contact.service.js';
import { CountryService } from '#Services/country.service.js';
import { PipelineService } from '#Services/pipeline.service.js';
import { QuoteService } from '#Services/quote.service.js';
import { UserProfileService } from '#Services/user-profile.service.js';
import { UserService } from '#Services/user.service.js';

import {
  createCompanyLoader,
  createContactLoader,
  createCountryLoader,
  createQuoteLoader,
  createTimezoneLoader,
  createUserProfileLoader,
} from './loaders.js';

export interface GraphqlContext {
  auth: { client_id: UUID; role: UserRoles };
  loaders: {
    Country: CountryDataLoader;
    Company: CompanyDataLoader;
    Contact: ContactDataLoader;
    Quote: QuoteDataLoader;
    Timezone: TimezoneDataLoader;
    UserProfile: UserProfileDataLoader;
  };
  services: {
    Calendar: CalendarService;
    Company: CompanyService;
    Contact: ContactService;
    Country: CountryService;
    Pipeline: PipelineService;
    Quote: QuoteService;
    UserProfile: UserProfileService;
  };
}

interface GraphQLRequestBody {
  query?: string;
}

const { GRAPHQL_INTROSPECT_AUTH } = secrets;

const isIntrospectionQuery = (req: Request<unknown, unknown, GraphQLRequestBody>) => {
  const { authorization, origin, 'user-agent': userAgent } = req.headers;

  if (!(origin === 'https://studio.apollographql.com' || (userAgent && userAgent.startsWith('PostmanClient'))))
    return false;
  if (!GRAPHQL_INTROSPECT_AUTH || authorization !== `Bearer ${GRAPHQL_INTROSPECT_AUTH}`) return false;
  if (!req.body.query?.includes('__schema') && !req.body.query?.includes('__type')) return false;
  return true;
};

const graphqlContext = async ({
  req,
}: {
  req: Request<unknown, unknown, GraphQLRequestBody>;
  res: Response;
}): Promise<GraphqlContext> => {
  const { authorization } = req.headers;

  if (isIntrospectionQuery(req)) return {} as GraphqlContext;

  let JWT;
  if (authorization && authorization.startsWith('Bearer')) {
    JWT = authorization.split(' ')[1];
  } else if (req.authJWT) {
    JWT = req.authJWT;
  }

  if (!JWT)
    throw new GraphQLError('Unauthorized. Please login', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });

  const userRepository = new PostgresUserRepository();
  const userService = new UserService(userRepository, redisClient, postgresDB);
  const { client_id, jti, role } = userService.verifyAuthToken(JWT);
  await userService.isTokenBlacklisted(jti);

  const calendarRepository = new PostgresCalendarRepository();
  const companyRepository = new PostgresCompanyRepository();
  const contactRepository = new PostgresContactRepository();
  const countryRepository = new PostgresCountryRepository();
  const pipelineRepository = new PostgresPipelineRepository();
  const quoteRepository = new PostgresQuoteRepository();

  const calendarReadModel = new PostgresCalendarReadModel();
  const companyReadModel = new PostgresCompanyReadModel();
  const contactReadModel = new PostgresContactReadModel();
  const countryReadModel = new PostgresCountryReadModel();
  const pipelineReadModel = new PostgresPipelineReadModel();
  const quoteReadModel = new PostgresQuoteReadModel();
  const timezoneReadModel = new PostgresTimezoneReadModel();
  const userReadModel = new PostgresUserReadModel();

  const calendarService = new CalendarService({ calendarReadModel, calendarRepository, userReadModel });
  const companyService = new CompanyService({ companyReadModel, companyRepository, countryRepository, userReadModel });
  const contactService = new ContactService({ companyRepository, contactReadModel, contactRepository, userReadModel });
  const countryService = new CountryService({ countryRepository });
  const pipelineService = new PipelineService({ pipelineReadModel, pipelineRepository });
  const quoteService = new QuoteService({ quoteReadModel, quoteRepository });
  const userProfileService = new UserProfileService({ userReadModel, userRepository });

  const loaders = {
    Company: createCompanyLoader(companyReadModel),
    Contact: createContactLoader(contactReadModel),
    Country: createCountryLoader(countryReadModel),
    Quote: createQuoteLoader(quoteReadModel),
    Timezone: createTimezoneLoader(timezoneReadModel),
    UserProfile: createUserProfileLoader(userReadModel),
  };
  const services = {
    Calendar: calendarService,
    Company: companyService,
    Contact: contactService,
    Country: countryService,
    Pipeline: pipelineService,
    Quote: quoteService,
    UserProfile: userProfileService,
  };

  return { auth: { client_id, role }, loaders, services } satisfies GraphqlContext;
};

export default graphqlContext;
