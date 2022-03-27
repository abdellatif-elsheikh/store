import express, { Application, request, Request, response, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config';
import errorMiddleware from './middlewares/error.middleware';

const PORT = config.port || 3000;

const app: Application = express();
// add middleware to parse incoming requests
app.use(express.json());
// security

// add http request logger middleware
app.use(morgan('common'));
// http security middleware
app.use(helmet());
// error handler middleware
// create limit for api requests
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'to many requests please try agin after two mints',
});
app.use(limiter);

// ----------------------------------------------------------
// ------------------------ ROUTS ---------------------------
// add get request
app.get('/', (_req: Request, res: Response) => {
  throw new Error('error exist')
  res.json({
    message: 'Hello world!',
  });
});
// add post route
app.post('/', (req: Request, res: Response) => {
  req.body = {
    hamda: 'mosh hamada',
  };
  res.json({
    message: 'hello world from post request',
    data: req.body,
  });
});

app.use(errorMiddleware)
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: 'you are lost you can go back to Home http://localhost:5000/'
  })
})

// -------------------------------------------------
// -------------------------------------------------
// start server---------------------------------------
app.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
});

export default app;
