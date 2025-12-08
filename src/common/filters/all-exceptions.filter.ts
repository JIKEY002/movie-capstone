import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Default values
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let message = 'Internal Server Error';
        let stack = '';

        if (exception instanceof HttpException) {
            const excResponse = exception.getResponse();
            // excResponse có thể là string hoặc object
            if (typeof excResponse === 'string') {
                message = excResponse;
            } else if (
                typeof excResponse === 'object' &&
                excResponse !== null
            ) {
                // cố gắng lấy message field nếu có
                // (Nest thường trả { statusCode, message, error } cho HttpException)
                // message có thể là array (validation pipe) => stringify
                const maybeMessage =
                    (excResponse as any).message ?? (excResponse as any).error;
                if (Array.isArray(maybeMessage))
                    message = maybeMessage.join(', ');
                else if (typeof maybeMessage === 'string')
                    message = maybeMessage;
                else if ((excResponse as any).message)
                    message = String((excResponse as any).message);
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            stack = exception.stack ?? '';
        }

        // Optionally log full exception (helpful for debugging)
        this.logger.error({
            path: request?.url,
            method: request?.method,
            message,
            exception: exception instanceof Error ? exception.stack : exception,
        });

        const payload: any = {
            status: 'error',
            statusCode: status,
            message,
            stack,
        };

        // Ensure headers/status send
        response.status(status).json(payload);
    }
}
export default AllExceptionsFilter;
