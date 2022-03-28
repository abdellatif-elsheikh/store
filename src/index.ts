import express, { Application, Request, Response } from 'express';
import config from './config';
import middlewares from './middlewares';
import routes from './routes';

const PORT = config.port || 3000;

const app: Application = express();

app.use(
  express.json(),
  middlewares.helmetExport,
  middlewares.morganExport,
  middlewares.limiter
);

// * using routes
app.use('/api', routes);

// ----------------------------------------------------------
// ------------------------ ROUTS ---------------------------
// add get request
app.get('/', (_req: Request, res: Response): void => {
  res.json({
    message: 'Hello world!',
  });
});

// ! DONT MOVE THOSE MIDDLEWARES TO THE TOP
// Error handling middlewares
app.use(middlewares.errorMiddleware, middlewares.error_404);

// -------------------------------------------------
// -------------------------------------------------
// start server---------------------------------------
app.listen(PORT, (): void => {
  console.log(`server is running at port: ${PORT}`);
});

export default app;
