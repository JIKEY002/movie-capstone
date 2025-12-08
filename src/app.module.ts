import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { TokenModule } from 'src/common/token/token.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ProtectStrategy } from 'src/common/guard/protect/protect.strategy';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [ConfigModule.forRoot(), PrismaModule, TokenModule, AuthModule, UserModule],
    controllers: [AppController],
    providers: [AppService, ProtectStrategy],
})
export class AppModule {}
