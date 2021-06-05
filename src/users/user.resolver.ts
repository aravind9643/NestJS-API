import { Query, Resolver, Args, Parent, ResolveField, Mutation, Context } from "@nestjs/graphql";
import { CommentService } from "src/comment/comment.service";
import { Public } from "src/common/decorators/public.decorator";
import { User } from "src/common/decorators/user.decorator";
import { UserDTO } from "./user.dto";
import { UsersService } from "./users.service";

@Resolver('User')
export class UserResolver {
    constructor(private usersService: UsersService, private commentService: CommentService) { }

    @Query()
    async UsersList(@Args('page') page: number, @Args('limit') limit: number) {
        return await this.usersService.findAll(page, limit);
    }

    @Query()
    async profile(@Context('user') user) {
        const { username } = user;
        return await this.usersService.findOne(username);
    }

    @ResolveField()
    comments(@Parent() user) {
        const { id } = user;
        return this.commentService.showByUser(id);
    }

    @Public()
    @Mutation()
    register(@Args('username') username: string, @Args('password') password: string) {
        const user: UserDTO = { username, password };
        return this.usersService.register(user);
    }

    @Public()
    @Mutation()
    login(@Args('username') username: string, @Args('password') password: string) {
        const user: UserDTO = { username, password };
        return this.usersService.login(user);
    }
}