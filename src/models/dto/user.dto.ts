import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsArray()
    @IsOptional()
    roles: Array<string>;
}