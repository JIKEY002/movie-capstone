import { Module } from '@nestjs/common';

import { TokenService } from 'src/common/token/token.service';

@Module({
    exports: [TokenService],
    providers: [TokenService],
})
export class TokenModule {}
