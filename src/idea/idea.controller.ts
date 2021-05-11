import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
} from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { IdeaDTO } from './idea.dto';
import { IdeaService } from './idea.service';

@Controller('idea')
export class IdeaController {
    constructor(private ideaService: IdeaService) { }
    @Get()
    showIdeas(@User('id') userId) {
        return this.ideaService.showIdeas(userId);
    }

    @Get(':id')
    showIdea(@Param('id', ParseIntPipe) id, @User('id') userId) {
        return this.ideaService.showIdea(id, userId);
    }

    @Post()
    async createIdea(@Body() idea: IdeaDTO, @User('id') userId) {
        return await this.ideaService.createIdea(idea, userId);
    }

    @Put(':id')
    async updateIdea(@Param('id', ParseIntPipe) id, @User('id') userId, @Body() idea: Partial<IdeaDTO>) {
        return await this.ideaService.updateIdea(id, userId, idea);
    }

    @Delete(':id')
    async deleteIdea(@Param('id', ParseIntPipe) id, @User('id') userId) {
        return await this.ideaService.deleteIdea(id, userId);
    }
}
