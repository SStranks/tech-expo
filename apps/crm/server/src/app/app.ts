import type { NextFunction, Request, Response } from 'express';

import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { apolloServer, graphqlContext } from '#Graphql/index.js';
import { globalErrorHandler } from '#Middleware/index.js';
import { testRouter, userRouter } from '#Routes/index.js';
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

// GraphQL
app.use('/graphql', apolloMiddleware(apolloServer, { context: graphqlContext }));

// Routes
app.use('/api/users', userRouter);
app.use('/api/test', testRouter);

// Favicon
app.get('/favicon.ico', (_req, res) => {
  res.status(204).end();
});

// Error Handler
app.all(/(.*)/, (req: Request, _res: Response, next: NextFunction) => {
  next(
    new BadRequestError({ code: 404, logging: true, message: `Can't find route ${req.originalUrl} on this server!` })
  );
});

app.use(globalErrorHandler);

export default app;
