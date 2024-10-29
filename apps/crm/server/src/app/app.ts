import type { Application, NextFunction, Request, Response } from 'express';

import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { apolloServer } from '#Graphql/apolloServer';
import { globalErrorHandler } from '#Middleware/index';
import { userRouter } from '#Routes/index';
import { BadRequestError } from '#Utils/errors';

const corsOptions = {
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: 'http://localhost:3000',
};

const app: Application = express();
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
app.use('/graphql', apolloMiddleware(apolloServer));

// Routes
app.use('/api/users', userRouter);

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
