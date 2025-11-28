import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const secretKey = 'e0a48c02b598e0f1f39b5d3fac44338abfbe6a102eee891852727490841a2f76551f19b38d7ace6cd9e414ae5d42d4d6f2d65ae12522080e29153c35cbffa243';

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Token nije obezbeđen.' });
  }

  const token = authHeader.split(' ')[1]; // Ukloni "Bearer" deo

  jwt.verify(token, secretKey, (err: any, korisnik: any) => {
    if (err) {
      return res.status(403).json({ message: 'Nevažeći token.' });
    }

    // Dinamički dodaj `user` na request objekat
    req.user = korisnik;

    next(); // Idi na sledeći middleware ili rutu
  });
};
