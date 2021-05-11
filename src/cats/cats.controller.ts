import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { Cat, CreateCatDTO } from './cat.model';
import { CatsService } from './cats.service';

// @Public()
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) { }

  @Get()
  getCats() {
    return this.catsService.getCats();
  }

  @Get(':id')
  getCat(@Param('id', ParseIntPipe) id) {
    return this.catsService.getCat(id);
  }

  @Post()
  // @UseGuards(RolesGuard)
  // @Roles('admin')
  async createCat(@Body() cat: CreateCatDTO) {
    return await this.catsService.createCat(cat);
  }

  @Post('creatyMany')
  // @UseGuards(RolesGuard)
  // @Roles('admin')
  async createManyCats(@Body() cats: Cat[]) {
    return await this.catsService.createManyCats(cats);
  }

  @Delete()
  async delete(@Param('id', ParseIntPipe) id) {
    return await this.catsService.deleteCat(id);
  }
}
