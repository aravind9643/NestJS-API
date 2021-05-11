import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserDTO } from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Public()
  @Get()
  async getUsers() {
    return this.usersService.findAll();
  }

  @Public()
  @Post('register')
  async register(@Body() data: UserDTO) {
    return this.usersService.register(data);
  }

  @Get('profile')
  getProfile(@User() user) {
    return this.usersService.findOne(user.username);
  }
}
