import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto, UserDto } from 'src/modules/user/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findByUsername(username: string): Promise<User> {
    const userName = this.userRepository.findOneBy({ username });

    if (!userName) {
      throw new NotFoundException('user not found');
    }
    return userName;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  findById(userId: string): Promise<User> {
    const user = this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async create(body: UserDto, password: string): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({
      id: body.username,
    });

    if (existingUser) {
      throw new ConflictException('User already exist!');
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User();
    user.username = body.username;
    user.password = hash;
    user.email = body.email;
    user.roles = body.roles;

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User already exist!');
      }
      throw new HttpException(
        'Unknow error in register user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateUser(email: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect(['user.password', 'user.roles'])
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new NotFoundException('user not exist!');
    }
    return user;
  }

  async registerEmailOtpCode(userId: string, code: number) {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otpEmailCode = code;
    user.otpCodeEmailExpiresAt = expiresAt;

    await this.userRepository.save(user);

    return user;
  }

  async resetPassword(userId: string, password: string) {
    const user = await this.findById(userId);

    const hash = await bcrypt.hash(password, 10);

    user.password = hash;

    return await this.userRepository.save(user);
  }

  // user.service.ts
  async update(userId: string, updateData: UpdateUserDto): Promise<User> {
    const user = await this.findById(userId);

    if (updateData.username) user.username = updateData.username;
    if (updateData.email) user.email = updateData.email;
    if (updateData.roles) user.roles = updateData.roles;

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email or username already in use');
      }
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
