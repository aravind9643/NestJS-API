import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaEntity } from 'src/idea/idea.entity';
import { UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CommentDTO } from './comment.dto';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private commentRepository: Repository<CommentEntity>,
        @InjectRepository(IdeaEntity)
        private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    private toResponseObject(comment: CommentEntity) {
        return {
            ...comment,
            author: comment.author && comment.author.toResponse(),
        };
    }

    async showByIdea(ideaId: string) {
        const comments = await this.commentRepository.find({
            where: { idea: { id: ideaId } },
            relations: ['author', 'idea']
        });
        return comments.map(comment => this.toResponseObject(comment));
    }

    async showByUser(userId: string) {
        const comments = await this.commentRepository.find({
            where: { author: { id: userId } },
            relations: ['author', 'idea']
        });
        return comments.map(comment => this.toResponseObject(comment));
    }

    async show(id: string) {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ['author', 'idea'],
        });
        return this.toResponseObject(comment);
    }

    async create(ideaId: string, userId: string, data: CommentDTO) {
        const idea = await this.ideaRepository.findOne({ where: { id: ideaId } });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const comment = await this.commentRepository.create({
            ...data,
            idea,
            author: user,
        });
        await this.commentRepository.save(comment);
        return this.toResponseObject(comment);
    }

    async destroy(id: string, userId: string) {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ['author', 'idea'],
        });

        if (comment.author.id !== userId) {
            throw new HttpException(
                'You do not own this comment',
                HttpStatus.UNAUTHORIZED,
            );
        }

        await this.commentRepository.delete(id);
        return this.toResponseObject(comment);
    }
}
