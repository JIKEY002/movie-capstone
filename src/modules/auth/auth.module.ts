import { Module } from '@nestjs/common';

import { AuthService } from 'src/modules/auth/auth.service';
import { AuthController } from 'src/modules/auth/auth.controller';
import { TokenModule } from 'src/common/token/token.module';

@Module({
    imports: [TokenModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
