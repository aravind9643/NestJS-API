import { object, string } from 'joi';

export class UserDTO {
  username: string;
  password: string;
}

export class UserRO {
  id: string;
  username: string;
  created: Date;
  token?: string;
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
