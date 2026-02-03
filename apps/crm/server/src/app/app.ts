import type { NextFunction, Request, Response } from 'express';

import { expressMiddleware as apolloMiddleware } from '@as-integrations/express5';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { apolloServer } from '#Graphql/apolloServer.js';
import graphqlContext from '#Graphql/context.js';
import globalErrorHandler from '#Middleware/globalError.js';
import userRouter from '#Routes/userRoutes.js';
import { httpRequestCounter, httpRequestDurationSeconds, prometheusMetricsHandler } from '#Services/prometheus.js';
import BadRequestError from '#Utils/errors/BadRequestError.js';

import expressApp from './express.js';

const { NODE_ENV } = process.env;

const corsOrigins = () => {
  const devOrigins = ['http://localhost:3000', 'https://studio.apollographql.com'];
  const prodOrigins = ['http://localhost:3000'];
  return NODE_ENV === 'development' ? devOrigins : prodOrigins;
};

const corsOptions = {
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: corsOrigins(),
};

const app = expressApp;
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: !(NODE_ENV === 'development'),
    // NOTE:  Allow Apolloserver Sandbox
    crossOriginEmbedderPolicy: !(NODE_ENV === 'development'),
  })
);

/*
 * PRIVATE ROUTES - Not specified in Nginx reverse proxy-passing
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  httpRequestCounter.labels({ method: req.method, route: req.originalUrl, statusCode: res.statusCode }).inc();
  const end = httpRequestDurationSeconds.startTimer();

  res.on('finish', () => {
    end({ code: res.statusCode, method: req.method, route: req.path });
  });
  next();
});
app.get('/metrics', prometheusMetricsHandler);
app.get('/health', (_req, res: Response) => res.sendStatus(200));

/*
 * PUBLIC ROUTES
 */
app.use('/graphql', apolloMiddleware(apolloServer, { context: graphqlContext }));
app.use('/api/users', userRouter);

app.get('/favicon.ico', (_req, res) => {
  res.status(204).end();
});

app.all(/(.*)/, (req: Request, _res: Response, next: NextFunction) => {
  next(new BadRequestError({ logging: true, message: `Can't find route ${req.originalUrl} on this server!` }));
});

app.use(globalErrorHandler);

export default app;
