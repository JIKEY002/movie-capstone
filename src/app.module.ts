import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { TokenModule } from './common/token/token.module';

@Module({
    imports: [ConfigModule.forRoot(), PrismaModule, TokenModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
