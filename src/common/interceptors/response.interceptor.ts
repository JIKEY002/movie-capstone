import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PossibleControllerReturn } from 'src/common/types/interceptors/response.type';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const res = ctx.getResponse();
        // Lấy status code hiện tại của response (fallback về 200)
        const defaultStatusCode =
            res && res.statusCode ? res.statusCode : HttpStatus.OK;

        return next.handle().pipe(
            map((result: PossibleControllerReturn) => {
                // Nếu controller đã trả về object có những trường tương tự, tôn trọng (merge + fallback)
                if (
                    result &&
                    typeof result === 'object' &&
                    ('status' in result ||
                        'data' in result ||
                        'message' in result ||
                        'statusCode' in result)
                ) {
                    const statusCode = result.statusCode ?? defaultStatusCode;
                    return {
                        status: result.status ?? 'success',
                        statusCode,
                        message: result.message ?? 'ok',
                        data: result.data ?? null,
                        ...(result.stack ? { stack: result.stack } : {}),
                    };
                }

                // Normal wrapping for success
                return {
                    status: 'success',
                    statusCode: defaultStatusCode,
                    message: 'ok',
                    data: result === undefined ? null : result,
                };
            }),
        );
    }
}
export default TransformInterceptor;
