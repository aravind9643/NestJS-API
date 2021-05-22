import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { CommentDTO } from './comment.dto';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
    constructor(
        private commentService: CommentService
    ) { }

    @Get('idea/:id')
    showCommentsByIdea(@Param('id') ideaId: string) {
        return this.commentService.showByIdea(ideaId);
    }

    @Get('user/:id')
    showCommentsByUser(@Param('id') userId: string) {
        return this.commentService.showByUser(userId);
    }

    @Post('idea/:id')
    createComment(
        @Param('id') ideaId: string,
        @User('id') userId: string,
        @Body() data: CommentDTO,
    ) {
        return this.commentService.create(ideaId, userId, data);
    }

    @Get(':id')
    showComment(@Param('id') id: string) {
        return this.commentService.show(id);
    }

    @Delete(':id')
    destroyComment(@Param('id') id: string, @User('id') user: string) {
        return this.commentService.destroy(id, user);
    }
}
