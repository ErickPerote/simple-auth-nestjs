import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Badges } from './badges.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  otpEmailCode: number;

  @Column({ type: 'timestamp', nullable: true })
  otpCodeEmailExpiresAt: Date | null;

  @Column({ type: 'simple-json', nullable: true })
  roles: string[];

  @OneToMany(() => Badges, (badges) => badges.user)
  badges: Badges[];
}