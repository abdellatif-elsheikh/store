import express, { Application, Request, Response } from 'express';
const PORT = 5000;

const app: Application = express();

app.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello world!',
  });
});

export default app;
