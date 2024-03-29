import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.gaurd';
import { ConfigModule } from '@nestjs/config';
import { IdeaModule } from './idea/idea.module';
import { CommentModule } from './comment/comment.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthGuard } from './common/gaurds/auth.guard';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    CatsModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ headers: req.headers })
    }),
    TypeOrmModule.forRoot({
      // type: 'sqlite',
      // database: __dirname + '/test.sqlite',
      // entities: ['dist/**/*.entity{.ts,.js}'],
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "1234",
      database: "aravind",
      synchronize: true,
      logging: true,
      autoLoadEntities: true
    }),
    UsersModule,
    AuthModule,
    IdeaModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppGateway,
  ],
})
export class AppModule { }
