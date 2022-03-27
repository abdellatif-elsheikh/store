import express, { Application, Request, Response } from 'express';
import config from './config';
import middlewares from './middlewares';

const PORT = config.port || 3000;

const app: Application = express();

app.use(
  express.json(),
  middlewares.helmetExport,
  middlewares.morganExport,
  middlewares.limiter
);

// ----------------------------------------------------------
// ------------------------ ROUTS ---------------------------
// add get request
app.get('/', (_req: Request, res: Response): void => {
  res.json({
    message: 'Hello world!',
  });
});
// add post route
app.post('/', (req: Request, res: Response): void => {
  req.body = {
    hamda: 'mosh hamada',
  };
  res.json({
    message: 'hello world from post request',
    data: req.body,
  });
});

app.use((_req: Request, res: Response): void => {
  res.status(404).json({
    message: 'you are lost you can go back to Home http://localhost:5000/',
  });
});

// Error handling middleware
app.use(middlewares.errorMiddleware);

// -------------------------------------------------
// -------------------------------------------------
// start server---------------------------------------
app.listen(PORT, (): void => {
  console.log(`server is running at port: ${PORT}`);
});

export default app;
