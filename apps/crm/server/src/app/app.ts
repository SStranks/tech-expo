import type { Application, Response, Request, NextFunction } from 'express';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { globalErrorHandler } from '#Middleware/index';
import { AppError } from '#Utils/index';

const app: Application = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.get('/', (req: Request, res: Response) => {
  res.send('Helloworld');
});

// Error Handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find route ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
