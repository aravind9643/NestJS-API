import { CommentEntity } from "src/comment/comment.entity";
import { UserEntity } from "src/users/user.entity";

export interface IdeaDTO {
    id?: string;
    idea: string;
    description: string;
    created: Date;
    updated: Date,
    author: UserEntity,
    comments: CommentEntity[]
}