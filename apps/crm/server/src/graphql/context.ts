import type { UserRoles } from '@apps/crm-shared/src/types/api/auth.js';
import type { UUID } from '@apps/crm-shared/src/types/api/base.js';
import type { Request, Response } from 'express';

import type { CountryDataLoader } from './loaders.ts';

import { GraphQLError } from 'graphql';

import { postgresDB } from '#Config/dbPostgres.js';
import { redisClient } from '#Config/dbRedis.js';
import { secrets } from '#Config/secrets.js';
import PostgresCompanyRepository from '#Models/company/PostgresCompanyRepository.js';
import PostgresCountryRepository from '#Models/country/PostgresCountryRepository.js';
import { CompanyService } from '#Services/Company.js';
import { CountryService } from '#Services/Country.js';
import UserService from '#Services/User.js';

import { createCountryLoader } from './loaders.js';

export interface GraphqlContext {
  auth: { client_id: UUID; role: UserRoles };
  loaders: { Country: CountryDataLoader };
  services: { Company: CompanyService };
}

const { GRAPHQL_INTROSPECT_AUTH } = secrets;
const { JWT_COOKIE_AUTH_ID } = process.env;

const isIntrospectionQuery = (req: Request) => {
  const { authorization, origin, 'user-agent': userAgent } = req.headers;

  if (!(origin === 'https://studio.apollographql.com' || (userAgent && userAgent.startsWith('PostmanClient'))))
    return false;
  if (!GRAPHQL_INTROSPECT_AUTH || authorization !== `Bearer ${GRAPHQL_INTROSPECT_AUTH}`) return false;
  if (!req.body.query.includes('__schema') && !req.body.query?.includes('__type')) return false;
  return true;
};

const graphqlContext = async ({ req }: { req: Request; res: Response }): Promise<GraphqlContext> => {
  const { authorization } = req.headers;
  const { [`${JWT_COOKIE_AUTH_ID}`]: authCookie } = req.cookies;

  if (isIntrospectionQuery(req)) return {} as GraphqlContext;

  let JWT;
  if (authorization && authorization.startsWith('Bearer')) {
    JWT = authorization.split(' ')[1];
  } else if (authCookie) {
    JWT = authCookie;
  }

  if (!JWT)
    throw new GraphQLError('Unauthorized. Please login', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });

  const userService = new UserService(redisClient, postgresDB);
  const { client_id, jti, role } = userService.verifyAuthToken(JWT);
  await userService.isTokenBlacklisted(jti);

  const countryRepo = PostgresCountryRepository;
  const companyRepo = PostgresCompanyRepository;
  const countryService = new CountryService(countryRepo);
  const companyService = new CompanyService(companyRepo);

  const loaders = { Country: createCountryLoader(countryService) };
  const services = { Company: companyService };

  return { auth: { client_id, role }, loaders, services };
};

export default graphqlContext;
