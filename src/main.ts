import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from 'src/app.module';

import { APP_PORT } from 'src/common/constant/app.constant';
import TransformInterceptor from 'src/common/interceptors/response.interceptor';
import AllExceptionsFilter from 'src/common/filters/all-exceptions.filter';
import { ProtectGuard } from 'src/common/guard/protect/protect.guard';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const reflector = app.get(Reflector);
    app.useGlobalGuards(new ProtectGuard(reflector));

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    app.useGlobalInterceptors(new TransformInterceptor());

    app.useGlobalFilters(new AllExceptionsFilter());

    app.setGlobalPrefix('api');
    await app.listen(APP_PORT);
}
bootstrap().catch((err) => {
    console.error('Error during application bootstrap:', err);
    process.exit(1);
});
