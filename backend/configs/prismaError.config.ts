import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';

    switch (exception.code) {
      // Unique constraint violation
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = 'Resource already exists';
        break;

      // Record not found
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'Resource not found';
        break;

      // Foreign key constraint
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'Related resource does not exist';
        break;

      // Required relation violation
      case 'P2014':
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid relation';
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.code,
    });
  }
}
