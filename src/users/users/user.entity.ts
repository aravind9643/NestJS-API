import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRO } from './user.dto';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  // @OneToMany(type => CatEntity, cat => cat.user)
  // cats: CatEntity[];

  @BeforeInsert()
  async hassPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponse(): UserRO {
    const { id, created, username } = this;
    return { id, created, username };
  }

  async comparePassword(attempt: string): Promise<boolean> {
    if (await bcrypt.compare(attempt, this.password)) return true;
    return false;
  }
}
