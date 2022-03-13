import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const PORT = 5000;

const app: Application = express();
// add middleware to parse incoming requests
app.use(express.json());

// add http request logger middleware
app.use(morgan('common'));
// http security middleware
app.use(helmet());
// create limit for api requests
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'to many requests please try agin after two mints',
});
app.use(limiter);
// add get request
app.get('/', (_req: Request, res: Response) => {
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

// -------------------------------------------------
// -------------------------------------------------
// start server---------------------------------------
app.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
});

export default app;
