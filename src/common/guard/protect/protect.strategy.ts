import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { ACCESS_TOKEN_SECRET } from 'src/common/constant/app.constant';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class ProtectStrategy extends PassportStrategy(Strategy, 'protect') {
    constructor(private readonly prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: ACCESS_TOKEN_SECRET,
        });
    }

    async validate(payload: any) {
        if (!payload.maNguoiDung) {
            throw new UnauthorizedException('Invalid token payload');
        }
        const userExists = await this.prismaService.nguoiDung.findUnique({
            where: { id: payload.maNguoiDung },
            omit: { password: true },
        });

        if (!userExists) {
            throw new UnauthorizedException('User no longer exists');
        }
        return userExists;
    }
}
