import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username, true) as UserEntity;
    if (!user) {
      throw new HttpException('Invalid Username', HttpStatus.BAD_REQUEST);
    }
    if (user && (await user.comparePassword(pass))) {
      const { password, ...result } = user;
      return result;
    }
    throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
  }

  async getJwtToken(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async geLoginDetails(data) {
    const { username } = data;
    const token = await this.getJwtToken(data);
    const user = await this.usersService.findOne(username);
    if (user) {
      const { ideas, bookmarks, ...result } = user;
      return { ...result, ...token };
    }
    return { ...data, ...token };
  }
}
