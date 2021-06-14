import express from 'express';
import routes from './routes';
import * as dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

//routes
app.use(routes)
app.listen(port, () => {
  console.log('app is listening to port: ', port)
});