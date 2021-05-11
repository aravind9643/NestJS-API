import {
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Post,
  UseFilters,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthService } from './auth/auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.gaurd';
import { Public } from './common/decorators/public.decorator';
import { User } from './common/decorators/user.decorator';

@Controller()
// @UseFilters(HttpExceptionFilter)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private configService: ConfigService
  ) {
    console.log("Postgres host from env : ", configService.get("POSTGRES_HOST"));
  }

  @Get()
  // @UseFilters(HttpExceptionFilter)
  @Public()
  getHello(): string {
    return this.appService.getHello();
    // throw new InternalServerErrorException();
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.geLoginDetails(req.user);
    // return req.user;
  }
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}
