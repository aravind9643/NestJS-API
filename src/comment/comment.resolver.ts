import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CommentDTO } from "./comment.dto";
import { CommentService } from "./comment.service";

@Resolver()
export class CommentResolver {
    constructor(private commentService: CommentService) { }

    @Query()
    async comment(@Args('id') id: string) {
        return await this.commentService.show(id);
    }

    @Mutation()
    async createComment(@Args('id') id: string, @Args('comment') comment: string, @Context('user') user) {
        const { id: userId } = user;
        const data: CommentDTO = { comment }
        return await this.commentService.create(id, userId, data);
    }
    @Mutation()
    async deleteComment(@Args('id') id: string, @Context('user') user) {
        const { id: userId } = user;
        return await this.commentService.destroy(id, userId);
    }
}