import { IsNotEmpty, IsString } from 'class-validator';

export class SearchUsersDto {
    @IsNotEmpty()
    @IsString()
    search: string;
}
