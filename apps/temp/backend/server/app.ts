import cors from 'cors';
import express, { Application } from 'express';

import invoiceRouter from '#Routes/invoiceRoutes.js';

const app: Application = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/test', (req, res) => {
  return res.status(200).json({ message: 'test complete' });
});
app.use('/api/v1/invoices', invoiceRouter);

export default app;
