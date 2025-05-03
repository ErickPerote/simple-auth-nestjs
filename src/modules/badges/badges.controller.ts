import { Body, Controller, Param, Patch, Post, Req } from "@nestjs/common";
import { Badges } from "src/entity/badges.entity";
import { BadgesDto } from "src/modules/badges/badges.dto";
import { BadgeService } from "./badges.service";
import { Roles } from "src/config/roles.decoraator";
import { Role } from "src/models/enums/role.enum";

@Controller('badge')
export class BadgeController {
    constructor(
        private readonly badgeService: BadgeService,
    ) { }

    @Post('create')
    @Roles(Role.User)
    async create(@Body() body: BadgesDto): Promise<Badges> {
        return await this.badgeService.create(body);
    }

    @Patch('assign/:badgeId')
    async assign(@Param('badgeId') id: number, @Body() Body: { userId: string }): Promise<Badges> {
        return await this.badgeService.assignUserId(id, Body.userId)
    }
}