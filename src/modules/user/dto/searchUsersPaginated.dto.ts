import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class SearchUsersPaginatedDto {
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    page: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    pageSize: number;

    @IsNotEmpty()
    @IsString()
    search?: string;
}
