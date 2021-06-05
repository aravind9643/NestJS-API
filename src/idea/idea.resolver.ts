import { Query, Resolver, Args, ResolveField, Parent } from "@nestjs/graphql";
import { CommentService } from "src/comment/comment.service";
import { IdeaService } from "./idea.service";

@Resolver('Idea')
export class IdeaResolver {
    constructor(private ideaService: IdeaService, private commentService: CommentService) { }
    @Query()
    ideas(@Args('page') page: number, @Args('limit') limit: number) {
        return this.ideaService.showIdeas(page, limit)
    }
    @ResolveField()
    comments(@Parent() idea) {
        const { id } = idea;
        return this.commentService.showByIdea(id);
    }
}