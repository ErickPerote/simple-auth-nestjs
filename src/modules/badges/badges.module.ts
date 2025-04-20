import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Badges } from "src/entity/badges.entity";
import { BadgeController } from "./badges.controller";
import { BadgeService } from "./badges.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Badges]), UserModule],
  controllers: [BadgeController],
  providers: [BadgeService],
  exports: [BadgeService]
})
export class BadgeModule { }
