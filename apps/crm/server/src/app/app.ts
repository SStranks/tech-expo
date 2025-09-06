import type { NextFunction, Request, Response } from 'express';

import { expressMiddleware as apolloMiddleware } from '@as-integrations/express5';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { apolloServer, graphqlContext } from '#Graphql/index.js';
import { globalErrorHandler } from '#Middleware/index.js';
import { userRouter } from '#Routes/index.js';
import { httpRequestCounter, httpRequestDurationSeconds, prometheusMetricsHandler } from '#Services/index.js';
import { BadRequestError } from '#Utils/errors/index.js';

import expressApp from './express.js';

const corsOrigins = () => {
  const devOrigins = ['http://localhost:3000', 'https://studio.apollographql.com'];
  const prodOrigins = ['http://localhost:3000'];
  return process.env.NODE_ENV === 'development' ? devOrigins : prodOrigins;
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
    contentSecurityPolicy: !(process.env.NODE_ENV === 'development'),
    // NOTE:  Allow Apolloserver Sandbox
    crossOriginEmbedderPolicy: !(process.env.NODE_ENV === 'development'),
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
  next(
    new BadRequestError({ code: 404, logging: true, message: `Can't find route ${req.originalUrl} on this server!` })
  );
});

app.use(globalErrorHandler);

export default app;
