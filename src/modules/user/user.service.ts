import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { UserDto } from "src/models/dto/user.dto";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    findByUsername(username: string): Promise<User> {
        const userName = this.userRepository.findOneBy({ username });

        if(!userName) {
            throw new NotFoundException('user not found')
        }
        return userName
    }

    findById(userId: string): Promise<User> {
        const user = this.userRepository.findOneBy({ id: userId });
        if(!user) {
            throw new NotFoundException('user not found')
        }
        return user
    } 

    async register(body: UserDto, password: string): Promise<User> {
        const existingUser = await this.userRepository.findOneBy({ id: body.username });

        if(existingUser)  {
            throw new ConflictException('User already exist!');
        }

        const hash = await bcrypt.hash(password, 10);

        const user = new User();
        user.username = body.username;
        user.password = hash;
        user.roles = body.roles;


        try {
            return await this.userRepository.save(user);
        } catch (error) {
            if(error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('User already exist!');
            }
            throw new HttpException('Unknow error in register user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async validateUser(username: string): Promise<User> {
        const user = await this.userRepository
        .createQueryBuilder('user')
        .addSelect(['user.password', 'user.roles']) 
        .where('user.username = :username', {username})
        .getOne();

        if(!user) {
            throw new NotFoundException('user not exist!')
        }
        return user
    }
}