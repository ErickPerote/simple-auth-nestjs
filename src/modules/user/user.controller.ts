import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Public } from 'src/config/publicRoutes.decorator';
import { User } from 'src/entity/user.entity';
import { UpdateUserDto, UserDto } from 'src/modules/user/user.dto';
import { UserService } from 'src/modules/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: UserDto): Promise<User> {
    return await this.userService.create(body, body.password);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(userId, updateUserDto);
  }
}
