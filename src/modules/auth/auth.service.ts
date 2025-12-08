import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/common/prisma/prisma.service';
import { TokenService } from 'src/common/token/token.service';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly tokenService: TokenService,
    ) {}

    async register(registerDto: RegisterDto) {
        const userExist = await this.prismaService.nguoiDung.findUnique({
            where: {
                email: registerDto.email,
            },
        });

        if (userExist) {
            throw new BadRequestException('Người dùng đã tồn tại');
        }

        const hashPassword = bcrypt.hashSync(registerDto.password, 10);

        const userNew = await this.prismaService.nguoiDung.create({
            data: {
                email: registerDto.email,
                password: hashPassword,
                hoTen: registerDto.hoTen,
                phone: registerDto.phone,
            },
            select: {
                id: true,
                email: true,
                hoTen: true,
                phone: true,
            },
        });

        return {
            message: 'Đăng ký thành công',
            data: userNew,
        };
    }

    async login(loginDto: LoginDto) {
        const userExist = await this.prismaService.nguoiDung.findUnique({
            where: {
                email: loginDto.email,
            },
        });

        if (!userExist) {
            throw new BadRequestException('Người dùng không tồn tại');
        }

        if (!userExist.password) {
            throw new BadRequestException(
                'Vui lòng đăng nhập bằng OAuth, để câp nhật mật khẩu',
            );
        }

        const isPassword = bcrypt.compareSync(
            loginDto.password,
            userExist.password,
        );

        if (!isPassword) {
            throw new BadRequestException(
                'Người dùng hoặc mật khẩu không đúng',
            );
        }

        const token = await this.tokenService.createTokens({
            maNguoiDung: userExist.id,
        });

        return {
            message: 'Đăng nhập thành công',
            data: token,
        };
    }
}
