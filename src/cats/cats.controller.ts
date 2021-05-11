import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { Cat, CreateCatDTO } from './cat.model';
import { CatsService } from './cats.service';

// @Public()
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) { }

  @Get()
  getCats(@User('id') userId) {
    return this.catsService.getCats(userId);
  }

  @Get(':id')
  getCat(@Param('id', ParseIntPipe) id, @User('id') userId) {
    return this.catsService.getCat(id, userId);
  }

  @Post()
  async createCat(@Body() cat: CreateCatDTO, @User('id') userId) {
    return await this.catsService.createCat(cat, userId);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id, @User('id') userId, @Body() cat: Partial<CreateCatDTO>) {
    return await this.catsService.updateCat(id, cat, userId);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id, @User('id') userId) {
    return await this.catsService.deleteCat(id, userId);
  }

  @Post('creatyMany')
  async createManyCats(@Body() cats: Cat[]) {
    return await this.catsService.createManyCats(cats);
  }
}
