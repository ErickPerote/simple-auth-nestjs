import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../modules/user/user.service';
import { User } from 'src/entity/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'default-secret',
    });
  }

  async validate(payload: User) {
    const user = await this.userService.findByUsername(payload.username);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
