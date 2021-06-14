import axios from 'axios';
import express, { Request, Response, NextFunction } from 'express';
import * as BufferStuff from 'safe-buffer';
const Buffer = BufferStuff.Buffer;
import * as dotenv from "dotenv";
import { CustomRequestProps, CustomResponseProps } from 'src/types';

dotenv.config();
const routes = express();

let authToken = '';
authToken = 'Basic ' + Buffer.from(process.env.CONSUMER_KEY + ':' + process.env.CONSUMER_SECRET).toString('base64')

if (process.env.NODE_ENV === "development") authToken = 'Basic ' + process.env.DEVELOPER_AUTH_TOKEN;

axios.defaults.headers.common['Authorization'] = authToken;


routes.get('/', (req, res) => {
  res.send("we are here");
});

const accessTokenMiddleware = async (req: CustomRequestProps, res: Response, next: NextFunction) => {
  try {
    const { data } = await axios.get(process.env.SANDBOX_CREDEDNTIAL_URL, {
      headers: {
        Authorization: authToken
      }
    });

    if (data) {
      req.accessToken = data.access_token;
      next();
    } else {
      res.status(500).send("Token Invalid");
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

// register urls 
routes.get('/register', accessTokenMiddleware, async (req: CustomRequestProps, res: CustomResponseProps) => {
  try {
    console.log("req.accessToken: ", req.accessToken)
    const registerurl = 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl';
    const bearerToken = `Bearer ${req.accessToken}`;

    const { data } = await axios.post(registerurl, {
      "ShortCode": "174379",
      "ResponseType": "Complete",
      "ConfirmationURL": `http://${process.env.LOCALHOST}:5000/confirmation`,
      "ValidationURL": `http://${process.env.LOCALHOST}:5000/validation_url`,
    }, {
      headers: {
        Authorization: bearerToken
      }
    });

    if (data) {
      res.status(200).send(data);
    } else {
      res.status(400).send('Failed');
    }
  } catch (error) {
    console.log(error);
  }
})

// register urls for confirmations

routes.post('/confirmation', (req: CustomRequestProps, res: CustomResponseProps) => {
  try {
    console.log("++++++++++++++++++++++++confirmation++++++++++++++++++++++++");
    console.log(res.body);

  } catch (error) {
    console.log(error);

  }
})

// register urls for validation

routes.post('/validation', (req: CustomRequestProps, res: CustomResponseProps) => {
  try {
    console.log("++++++++++++++++++++++++validation++++++++++++++++++++++++");
    console.log(res.body);

  } catch (error) {
    console.log(error);

  }
})


// register urls for simulation

routes.post('/simulate', async (req: CustomRequestProps, res: Response) => {
  try {
    console.log("++++++++++++++++++++++++simulating++++++++++++++++++++++++");
    const { data } = await axios.post('', {
      "ShortCode": "174379",
      "CommandID": "CustomerPayBillOnline",
      "Amount": " ",
      "Msisdn": " ",
      "BillRefNumber": " "
    }, {
      headers: {
        Authorization: authToken
      }
    })

  } catch (error) {
    console.log(error);

  }
})


export default routes;