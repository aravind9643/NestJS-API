import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CatEntity } from './cat.entity';
import { Cat, CreateCatDTO } from './cat.model';
@Injectable()
export class CatsService {
  // private readonly cats: Cat[] = [];
  constructor(
    @InjectRepository(CatEntity)
    private catsRepository: Repository<CatEntity>,
    private connection: Connection,
  ) { }
  async createCat(cat: CreateCatDTO) {
    // if (!cat.name || !cat.age)
    //     return { message: "Missing some fields.." };
    // if (this.cats.find(c => c.name == cat.name))
    //     return { message: "Cat already exists with that name.." };
    // cat.id = this.getUID()
    // this.cats.push(cat);
    // return { message: "Cat created", id: cat.id };

    // return await this.catsRepository.insert(cat);
    const catIntance = this.catsRepository.create(cat);
    return await this.catsRepository.save(catIntance);
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

  getCat(id: number) {
    // let cat = this.cats.find(c => c.id == id);
    // if (cat)
    //     return cat;
    // else
    //     throw new NotFoundException(`Cat with id: ${id} not found`);
    return this.catsRepository.findOne({ where: { id } });
  }

  getCats() {
    // return this.cats;
    return this.catsRepository.find();
  }

  async deleteCat(id: number) {
    // let catIndex = this.cats.findIndex(c => c.id == id);
    // if (catIndex) {
    //     this.cats.splice(catIndex, 1);
    //     return { message: "Cat Removed.." };
    // }
    // else
    //     return { message: 'No cat found with that id..' };
    return await this.catsRepository.delete(id);
  }

  getUID(): number {
    const date = new Date();
    return date.getTime();
  }
}
