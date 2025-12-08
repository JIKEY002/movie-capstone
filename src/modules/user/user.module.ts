import { Module } from '@nestjs/common';

import { UserService } from 'src/modules/user/user.service';
import { UserController } from 'src/modules/user/user.controller';

@Module({
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
