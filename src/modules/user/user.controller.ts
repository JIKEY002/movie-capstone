import { Controller, Get, Post, Query, Request } from '@nestjs/common';
import * as express from 'express';

import { Public } from 'src/common/decorators/public.decorator';
import { UserService } from 'src/modules/user/user.service';
import { QueryDto } from 'src/modules/user/dto/query.dto';
import { SearchUsersDto } from 'src/modules/user/dto/searchUsers.dto';
import { SearchUsersPaginatedDto } from 'src/modules/user/dto/searchUsersPaginated.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Public()
    @Get('LayDanhSachLoaiNguoiDung')
    getUserTypeList() {
        return this.userService.getUserTypeList();
    }

    @Public()
    @Get('LayDanhSachNguoiDung')
    getUserList() {
        return this.userService.getUserList();
    }

    @Public()
    @Get('LayDanhSachNguoiDungPhanTrang')
    getUserListPaginated(@Query() queryDto: QueryDto) {
        return this.userService.getUserListPaginated(queryDto);
    }

    @Public()
    @Get('TimKiemNguoiDung')
    searchUsers(@Query() searchUsersDto: SearchUsersDto) {
        return this.userService.searchUsers(searchUsersDto);
    }

    @Public()
    @Get('TimKiemNguoiDungPhanTrang')
    searchUsersPaginated(
        @Query() searchUsersPaginatedDto: SearchUsersPaginatedDto,
    ) {
        return this.userService.searchUsersPaginated(searchUsersPaginatedDto);
    }

    @Post('ThongTinTaiKhoan')
    getAccountInfo(@Request() req: express.Request) {
        return this.userService.getAccountInfo(req);
    }
}
