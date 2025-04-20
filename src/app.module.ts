import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './services/jwtStrategy.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './guard/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { BadgeModule } from './modules/badges/badges.module';
import { RolesGuard } from './guard/roles.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + "/**/**.entity{.ts,.js}"],
      synchronize: true,
      autoLoadEntities: true,
    }),
    PassportModule,
    UserModule,
    AuthModule,
    BadgeModule
  ],
  providers: [
    JwtStrategy,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
})
export class AppModule { }
