import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Badges } from "src/entity/badges.entity";
import { User } from "src/entity/user.entity";
import { BadgesDto } from "src/modules/badges/badges.dto";
import { DataSource, Repository } from "typeorm";
import { UserService } from "../user/user.service";


@Injectable()
export class BadgeService {
    constructor(
        @InjectRepository(Badges)
        private badgeRepository: Repository<Badges>,
        private readonly userService: UserService,
        private dataSource: DataSource
    ) { }

    async create(body: BadgesDto): Promise<Badges> {
        const badge = this.badgeRepository.create(
            {
                description: body.description,
                name: body.name,
                user: body.userId ? { id: body.userId } as User : null
            }
        );

        return await this.badgeRepository.save(badge)
    }

    async assignUserId(id: number, userId: string): Promise<Badges> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const badge = await queryRunner.manager.findOne(Badges, {
                where: { id },
                lock: { mode: 'pessimistic_write' },
                relations: ['user']
            })

            if (!badge) throw new NotFoundException("Badge not found");
            if (badge.user) throw new ConflictException("Badge already assigned");
        
            const user = await this.userService.findById(userId);
            if (!user) throw new NotFoundException("User not found");
        
            badge.user = user;
            const saved = await queryRunner.manager.save(badge);
        
            await queryRunner.commitTransaction();
            return saved;        
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
        
    }

    async findById(id: number): Promise<Badges> {
        return await this.badgeRepository.findOneBy({ id: id });
    }

}