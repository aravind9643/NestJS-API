import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        let message = (exception as any).message;

        // Logger.error(message, (exception as any).stack, `${request.method} ${request.url}`);

        let status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        switch (exception.constructor) {
            case HttpException:
                status = (exception as HttpException).getStatus();
                break;
            case QueryFailedError:
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as QueryFailedError).message;
                break;
            default:
                status = HttpStatus.INTERNAL_SERVER_ERROR
        }

        response.status(status)
            .json({
                statusCode: status,
                status: "error",
                message,
                timestamp: new Date().toISOString(),
                path: request.url,
                method: request.method
            });
    }
}