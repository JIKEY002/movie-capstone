import { BadRequestException, Injectable } from '@nestjs/common';
import * as express from 'express';

import { buildQuery } from 'src/common/helper/build-query.helper';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { QueryDto } from 'src/modules/user/dto/query.dto';
import { SearchUsersDto } from 'src/modules/user/dto/searchUsers.dto';
import { SearchUsersPaginatedDto } from 'src/modules/user/dto/searchUsersPaginated.dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    private select = {
        id: true,
        email: true,
        hoTen: true,
        phone: true,
        LoaiNguoiDung: {
            select: {
                tenLoai: true,
            },
        },
    };

    async getUserTypeList() {
        const userTypes = await this.prismaService.loaiNguoiDung.findMany({
            select: {
                id: true,
                tenLoai: true,
                moTa: true,
            },
        });
        return {
            message: 'Lấy danh sách loại người dùng thành công',
            data: userTypes,
        };
    }

    async getUserList() {
        const users = await this.prismaService.nguoiDung.findMany({
            where: {
                deletedAt: null,
            },
            select: this.select,
        });

        return {
            message: 'Lấy danh sách người dùng thành công',
            data: users,
        };
    }

    async getUserListPaginated(queryDto: QueryDto) {
        const { page, pageSize, index, filters } = buildQuery(queryDto);
        const usersPromise = this.prismaService.nguoiDung.findMany({
            where: {
                ...filters,
                isDeleted: false,
            },
            skip: index,
            take: pageSize,
            select: this.select,
        });

        const totalItemPromise = this.prismaService.nguoiDung.count({
            where: {
                ...filters,
                isDeleted: false,
            },
        });

        const [users, totalItem] = await Promise.all([
            usersPromise,
            totalItemPromise,
        ]);

        const totalPage = Math.ceil(totalItem / pageSize);

        return {
            message: 'Lấy danh sách người dùng thành công',
            data: {
                page: page,
                pageSize: pageSize,
                totalItem: totalItem,
                totalPage: totalPage,
                users: users || [],
            },
        };
    }

    async searchUsers(searchUsersDto: SearchUsersDto) {
        const { search } = searchUsersDto;
        const users = await this.prismaService.nguoiDung.findMany({
            where: {
                isDeleted: false,
                OR: [
                    { hoTen: { contains: search } },
                    { email: { contains: search } },
                    { phone: { contains: search } },
                ],
            },
            select: this.select,
        });

        return {
            message: 'Tìm kiếm người dùng thành công',
            data: users,
        };
    }

    async searchUsersPaginated(
        searchUsersPaginatedDto: SearchUsersPaginatedDto,
    ) {
        let { page, pageSize } = searchUsersPaginatedDto;
        const { search } = searchUsersPaginatedDto;

        const pageDefault = 1;
        const pageSizeDefault = 3;
        page = Math.max(pageDefault, Number(page) || pageDefault);
        pageSize = Math.max(
            pageSizeDefault,
            Number(pageSize) || pageSizeDefault,
        );

        const index = (page - 1) * pageSize;

        const filter = {
            isDeleted: false,
            OR: [
                { hoTen: { contains: search } },
                { email: { contains: search } },
                { phone: { contains: search } },
            ],
        };

        const usersPromise = this.prismaService.nguoiDung.findMany({
            where: filter,
            skip: index,
            take: pageSize,
            select: this.select,
        });

        const totalItemPromise = this.prismaService.nguoiDung.count({
            where: filter,
        });

        const [users, totalItem] = await Promise.all([
            usersPromise,
            totalItemPromise,
        ]);

        const totalPage = Math.ceil(totalItem / pageSize);
        return {
            message: 'Tìm kiếm người dùng thành công',
            data: {
                page: page,
                pageSize: pageSize,
                totalItem: totalItem,
                totalPage: totalPage,
                users: users || [],
            },
        };
    }

    async getAccountInfo(req: express.Request) {
        if (!req.user || !req.user['id']) {
            throw new BadRequestException('User not authenticated');
        }

        const userExists = await this.prismaService.nguoiDung.findUnique({
            where: { id: req.user['id'], isDeleted: false },
            include: {
                LoaiNguoiDung: true,
                DatVe: {
                    include: {
                        Ghe: {
                            include: {
                                RapPhim: {
                                    include: {
                                        CumRap: {
                                            include: { HeThongRap: true },
                                        },
                                    },
                                },
                            },
                        },
                        LichChieu: {
                            include: { Phim: { include: { Banner: true } } },
                        },
                    },
                },
            },
        });

        console.log('userExists', userExists);
    }
}
