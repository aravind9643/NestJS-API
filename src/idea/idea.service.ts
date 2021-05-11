import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { IdeaDTO } from './idea.dto';
import { IdeaEntity } from './idea.entity';

@Injectable()
export class IdeaService {
    constructor(
        @InjectRepository(IdeaEntity)
        private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    private toResponseObject(idea: IdeaEntity) {
        return { ...idea, owner: idea.author.toResponse() }
    }

    private ensureOwnerShip(idea: IdeaEntity, userId: string) {
        if (idea.author.id !== userId)
            throw new HttpException('Incorrect user', HttpStatus.BAD_REQUEST);
    }

    async showIdeas(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const ideas = await this.ideaRepository.find({ where: { owner: user }, relations: ['author'] });
        return ideas.map(idea => this.toResponseObject(idea));
    }

    async showIdea(id: string, userId: string) {
        const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
        this.ensureOwnerShip(idea, userId);
        return this.toResponseObject(idea);
    }

    async createIdea(data: IdeaDTO, userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const idea = this.ideaRepository.create({ ...data, author: user });
        await this.ideaRepository.save(idea);
        return this.toResponseObject(idea);
    }

    async updateIdea(id: string, userId, data: Partial<IdeaDTO>) {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
        if (!idea)
            throw new NotFoundException();
        this.ensureOwnerShip(idea, userId);
        await this.ideaRepository.update({ id }, data);
        idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
        return this.toResponseObject(idea);
    }

    async deleteIdea(id: string, userId) {
        const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
        if (!idea)
            throw new NotFoundException();
        this.ensureOwnerShip(idea, userId);
        await this.ideaRepository.delete(id);
        return this.toResponseObject(idea);
    }
}
