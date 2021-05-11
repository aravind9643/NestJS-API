import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { User } from 'src/users/users.service';
import { Connection, Repository } from 'typeorm';
import { CatEntity } from './cat.entity';
import { Cat, CreateCatDTO } from './cat.model';
@Injectable()
export class CatsService {

  constructor(
    @InjectRepository(CatEntity)
    private catsRepository: Repository<CatEntity>,
    private connection: Connection,
  ) { }

  private ensurePermission(cat: CatEntity, userId) {
    if (cat.userId !== userId)
      throw new HttpException('Invalid user', HttpStatus.BAD_REQUEST);
  }

  async getCats(userId: string) {
    return await this.catsRepository.find({ where: { userId } });
  }

  async getCat(id: number, userId: string) {
    const cat = await this.catsRepository.findOne({ where: { id } });
    this.ensurePermission(cat, userId)
    return cat;
  }

  async createCat(data: CreateCatDTO, userId: string) {
    const cat = this.catsRepository.create({ ...data, userId: userId });
    await this.catsRepository.save(cat);
    return cat;
  }

  async updateCat(id: number, data: Partial<CreateCatDTO>, userId: string) {
    const cat = await this.catsRepository.findOne({ where: { id } });
    if (!cat)
      throw new NotFoundException();
    this.ensurePermission(cat, userId);
    await this.catsRepository.update({ id }, data);
    return await this.catsRepository.findOne({ where: { id } });
  }

  async deleteCat(id: number, userId: string) {
    const cat = await this.catsRepository.findOne({ where: { id } });
    if (!cat)
      throw new NotFoundException();
    this.ensurePermission(cat, userId);
    await this.catsRepository.delete(id);
    return cat;
  }

  async createManyCats(cats: Cat[]) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const cat of cats) {
        await queryRunner.manager.save(cat);
      }
      queryRunner.commitTransaction();
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
