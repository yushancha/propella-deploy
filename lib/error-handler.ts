/**
 * 统一错误处理工具
 */

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * API错误响应格式
 */
export function createErrorResponse(error: unknown, defaultMessage: string = "Internal server error") {
  if (error instanceof AppError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
    };
  }
  
  if (error instanceof Error) {
    return {
      error: process.env.NODE_ENV === 'development' ? error.message : defaultMessage,
      statusCode: 500,
    };
  }
  
  return {
    error: defaultMessage,
    statusCode: 500,
  };
}

/**
 * 异步错误捕获装饰器
 */
export function catchAsync(fn: Function) {
  return (req: any, res: any, next?: any) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (next) next(err);
      else throw err;
    });
  };
}