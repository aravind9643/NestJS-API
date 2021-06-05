import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { CatEntity } from 'src/cats/cat.entity';
import { UserResolver } from './user.resolver';
import { IdeaEntity } from 'src/idea/idea.entity';
import { CommentEntity } from 'src/comment/comment.entity';
import { CommentService } from 'src/comment/comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CatEntity, IdeaEntity, CommentEntity])],
  providers: [UsersService, UserResolver, CommentService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule { }
