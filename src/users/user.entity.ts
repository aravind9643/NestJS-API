import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRO } from './user.dto';
import { CatEntity } from 'src/cats/cat.entity';
import { IdeaEntity } from 'src/idea/idea.entity';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/common/constants';

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

  @OneToMany(type => IdeaEntity, idea => idea.author)
  ideas: IdeaEntity[];

  @ManyToMany(type => IdeaEntity, { cascade: true })
  @JoinTable()
  bookmarks: IdeaEntity[];

  @BeforeInsert()
  async hassPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponse(showToken = false): UserRO {
    const { id, created, username } = this;
    const responseObject: UserRO = { id, created, username };
    if (this.ideas)
      responseObject.ideas = this.ideas;
    if (this.bookmarks) {
      responseObject.bookmarks = this.bookmarks;
    }
    if (showToken)
      responseObject.token = this.token;
    return responseObject;
  }

  get token() {
    const { id, username } = this;
    return jwt.sign(
      { id, username },
      jwtConstants.secret,
      { expiresIn: '1d' }
    )
  }

  async comparePassword(attempt: string): Promise<boolean> {
    if (await bcrypt.compare(attempt, this.password)) return true;
    return false;
  }
}
