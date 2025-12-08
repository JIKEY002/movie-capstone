import {
    ExecutionContext,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

export class ProtectGuard extends AuthGuard('protect') {
    constructor(public reflector: Reflector) {
        super();
    }
    // 1
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic === true) {
            return true;
        }

        return super.canActivate(context);
    }

    handleRequest(err, user, info): any {
        if (err || !user) {
            if (info instanceof TokenExpiredError) {
                // 403 để cho FE làm mới token
                throw new ForbiddenException(info.message);
            }
            if (info instanceof JsonWebTokenError) {
                // 401 để cho FE logout người dùng, vì token đang không hợp lệ, có dấu hiệu bất thường
                throw new UnauthorizedException(info.message);
            }
            throw err || new UnauthorizedException();
        }

        return user;
    }
}
