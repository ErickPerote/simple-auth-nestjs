import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entity/user.entity";
import { UserService } from "../user/user.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ) { }

    async login(user: User, password: string) {
        const payload = {
            username: user.username,
            id: user.id,
            roles: user.roles,
        };

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException();
        }

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async generateOtpCode(email: string) {
        const user = await this.userService.findByEmail(email);

        const code = Math.floor(100000 + Math.random() * 900000);

        const register =  await this.userService.registerEmailOtpCode(user.id, code)

        if(!register) {
            throw new BadRequestException();
        }

        return register
    }

    async verifyOtpEmailCode(userId: string, code: number) {
        const user = await this.userService.findById(userId)
        let isValid: boolean;

        if(!user.otpEmailCode || !user.otpCodeEmailExpiresAt) {
            throw new BadRequestException()
        }

        const now = new Date();

        if(user.otpEmailCode !== code) {
            isValid = false 
            throw new BadRequestException('Invalid code!')
        }

        if(user.otpCodeEmailExpiresAt < now) {
            isValid = false
            throw new BadRequestException('ExpiredCode')
        }

        isValid = true 

        return isValid
    }
}