import { object, string } from 'joi';
import { CatEntity } from 'src/cats/cat.entity';

export class UserDTO {
  username: string;
  password: string;
}

export class UserRO {
  id: string;
  username: string;
  created: Date;
  token?: string;
  cats?: CatEntity
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
