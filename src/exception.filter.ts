import { constants as httpStatus } from 'node:http2';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLoggerService } from './common/logger/logger.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLoggerService) {}

  catch<T>(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : httpStatus.HTTP_STATUS_INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? `${exception.message}`
        : `Unexpected: ${exception}`;

    this.logger.error(`[Exception Filter] ${message}`);

    const $responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    this.logger.debug(`[Response Body] ${JSON.stringify($responseBody)}\n`);

    response.status(status).json($responseBody);
  }
}
