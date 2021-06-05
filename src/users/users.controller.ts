import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserDTO } from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get()
  async getUsers(@Query('page') page: number, @Query('limit') limit: number) {
    return this.usersService.findAll(page, limit);
  }

  @Public()
  @Post('register')
  async register(@Body() data: UserDTO) {
    return this.usersService.register(data);
  }

  @Public()
  @Post('login')
  async login(@Body() data: UserDTO) {
    return this.usersService.login(data);
  }

  @Get('profile')
  getProfile(@User() user) {
    return this.usersService.findOne(user.username);
  }
}
