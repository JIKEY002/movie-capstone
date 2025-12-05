import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
} from 'src/common/constant/app.constant';

@Injectable()
export class TokenService {
    createTokens(paload: jwt.JwtPayload): any {
        const accessToken = jwt.sign(paload, ACCESS_TOKEN_SECRET, {
            expiresIn: '1d',
        });

        const refreshToken = jwt.sign(paload, REFRESH_TOKEN_SECRET, {
            expiresIn: '7d',
        });

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }

    verifyAccessToken(accessToken: string, option?: jwt.VerifyOptions): any {
        const decodeAccessToken = jwt.verify(
            accessToken,
            ACCESS_TOKEN_SECRET,
            option,
        );
        return decodeAccessToken;
    }

    verifyRefreshToken(refreshToken: string): any {
        const decodeRefreshToken = jwt.verify(
            refreshToken,
            REFRESH_TOKEN_SECRET,
        );
        return decodeRefreshToken;
    }
}
