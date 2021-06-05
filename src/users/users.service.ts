import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Public } from 'src/common/decorators/public.decorator';
import { Repository } from 'typeorm';
import { UserDTO, UserListRO, UserRO } from './user.dto';
import { UserEntity } from './user.entity';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  async findAll(page: number = 1, limit: number = 10): Promise<UserListRO> {
    const [users, count] = await this.userRepository.findAndCount({ relations: ['ideas', 'bookmarks'], take: limit, skip: limit * (page - 1) });
    return { users: users.map(user => user.toResponse()), count };
    // return users.map(user => user.toResponse());
  }

  async findOne(username: string, returnPassword = false) {
    const user = await this.userRepository.findOne({ where: { username }, relations: ['ideas', 'bookmarks'] });
    return returnPassword ? user : user.toResponse();
  }
  async login(data: UserDTO) {
    const { username, password } = data;
    let user = await this.userRepository.findOne({ where: { username } });
    if (!user)
      throw new HttpException('Invalid Username', HttpStatus.BAD_REQUEST);
    if (!user.comparePassword(password))
      throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
    return user.toResponse(true);
  }
  async register(data: UserDTO): Promise<UserRO> {
    const { username } = data;
    let user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    user = this.userRepository.create(data);
    await this.userRepository.save(user);
    return user.toResponse(true);
  }
}
