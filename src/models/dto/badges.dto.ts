import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class BadgesDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    userId?: string;
}