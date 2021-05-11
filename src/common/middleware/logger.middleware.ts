import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(
    'ReqUrl: ',
    req.url,
    'ReqBody: ',
    req.body ? JSON.stringify(req.body) : req.body,
    'ResStatusCode: ',
    res.statusCode,
  );
  next();
}
