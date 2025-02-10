import { IJwtPayload } from './types/lib/authentication/jwt/helper/types';
import express from 'express';

declare global {
    namespace Express {
    interface Request {
      user?: IJwtPayload
    }
  }
}


