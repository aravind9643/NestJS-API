// import { number, object, string } from 'joi';
import { IsBoolean, IsEmpty, isEmpty, IsNotEmpty, IsNumber } from 'class-validator';

export class Cat {
  id: number;
  name: string;
  age: number;
  isActive: boolean;
}

export class CreateCatDTO {
  id?: number;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  age: number;
  isActive: boolean;
}


// export const createCatSchema = object({
//   name: string()
//     .alphanum()
//     .min(3)
//     .max(20)
//     .required(),
//   age: number().required(),
// });
