import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { Public } from 'src/config/publicRoutes.decorator';
import { AuthDto } from 'src/modules/auth/auth.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserService } from 'src/modules/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: AuthDto) {
    const user = await this.userService.validateUser(body.email);

    return this.authService.login(user, body.password);
  }

  @Get('whoame')
  async getProfile(@Request() req) {
    return await this.userService.findById(req.user.id);
  }

  //TODO: criar método que valida email ao invés de usar tipo primitivo(string)
  @Public()
  @Post('forgot-password-code')
  async forgotPasswordCode(@Body('email') email: string) {
    const data = await this.authService.generateOtpCode(email);

    return data;
  }

  @Public()
  @Post('reset-password/:userId')
  async resetPassword(
    @Param('userId') userId: string,
    @Body('password') password: string,
    @Body('code') code: number,
  ) {
    const isValidCode = await this.authService.verifyOtpEmailCode(userId, code);

    if (!isValidCode) {
      throw new Error('sa');
    }

    const newPass = await this.userService.resetPassword(userId, password);

    return newPass;
  }
}
