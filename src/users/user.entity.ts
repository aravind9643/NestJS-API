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

  toResponse(): UserRO {
    const { id, created, username } = this;
    const responseObject: any = { id, created, username };
    if (this.ideas)
      responseObject.ideas = this.ideas;
    if (this.bookmarks) {
      responseObject.bookmarks = this.bookmarks;
    }
    return responseObject;
  }

  async comparePassword(attempt: string): Promise<boolean> {
    if (await bcrypt.compare(attempt, this.password)) return true;
    return false;
  }
}
