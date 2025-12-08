import { Injectable } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { PrismaClient } from 'src/common/prisma/generated/prisma/client';
import {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_PORT,
    DATABASE_USER,
} from 'src/common/constant/app.constant';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        const adapter = new PrismaMariaDb({
            host: DATABASE_HOST,
            port: Number(DATABASE_PORT),
            user: DATABASE_USER,
            password: DATABASE_PASSWORD,
            database: DATABASE_NAME,
            connectionLimit: 5,
        });
        super({ adapter });
    }
}
