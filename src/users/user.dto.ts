import { object, string } from 'joi';
import { CatEntity } from 'src/cats/cat.entity';
import { IdeaEntity } from 'src/idea/idea.entity';

export class UserDTO {
  username: string;
  password: string;
}

export class UserRO {
  id: string;
  username: string;
  created: Date;
  token?: string;
  cats?: CatEntity[];
  bookmarks?: IdeaEntity[];
  ideas?: IdeaEntity[];
}

export class UserListRO {
  users: UserRO[];
  count: number
}

export const userSchema = object({
  username: string()
    .min(8)
    .max(20)
    .required(),
  password: string()
    .min(8)
    .max(20)
    .required(),
});
