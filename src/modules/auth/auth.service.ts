import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entity/user.entity";
import { UserService } from "../user/user.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        ){}

    async login(user: User, password: string) {
        const payload = { 
            username: user.username, 
            id: user.id,
            roles: user.roles, 
         };

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch) {
            throw new UnauthorizedException();
        }

        return { 
            access_token: await this.jwtService.signAsync(payload),
        };
    }

}