import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  userId?: string; 
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return; 
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) {
      res.status(401).json({ message: 'Invalid token' });
      return; 
    }

    if (decoded && typeof decoded !== 'string') {
      req.userId = (decoded as JwtPayload).id; 
      next();
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  });
};
