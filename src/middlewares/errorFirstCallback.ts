import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  const status: number = err.status || res.locals.status || 500;
  res.status(status).json({
    error: {
      status: status,
      message: err.message,
    },
  });
};

export default errorHandler;
