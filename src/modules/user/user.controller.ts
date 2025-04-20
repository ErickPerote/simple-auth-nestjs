import { Body, Controller, HttpCode, HttpStatus, Post, UseFilters } from "@nestjs/common";
import { Public } from "src/config/publicRoutes.decorator";
import { User } from "src/entity/user.entity";
import { UserDto } from "src/models/dto/user.dto";
import { UserService } from "src/modules/user/user.service";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: UserDto): Promise<User> {
    return await this.userService.register(body, body.password);
  }
}