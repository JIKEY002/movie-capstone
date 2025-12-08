import {
    IsEmail,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    IsStrongPassword,
} from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    hoTen: string;

    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;
}
