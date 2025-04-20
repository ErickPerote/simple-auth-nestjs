import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { Public } from "src/config/publicRoutes.decorator";
import { AuthGuard } from "src/guard/auth.guard";
import { AuthDto } from "src/models/dto/auth.dto";
import { AuthService } from "src/modules/auth/auth.service";
import { UserService } from "src/modules/user/user.service";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() body: AuthDto) {
        const user = await this.userService.validateUser(body.username);
        
        return this.authService.login(user, body.password);
    }

    @Get('whoame')
    async getProfile(@Request() req) {
        return await this.userService.findById(req.user.id);
    }
} 