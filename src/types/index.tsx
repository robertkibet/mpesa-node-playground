import { Request, Response } from "express";

export interface CustomRequestProps extends Request {
  accessToken: string;
}
export interface CustomResponseProps extends Response {
  body: any; //todo
}
