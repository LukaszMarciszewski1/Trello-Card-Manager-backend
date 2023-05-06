import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Patch,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './models/user.entity';
import { User } from './models/user.class';
import { UpdateResult } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAllUsers(): Promise<UserEntity[] | null> {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: number): Promise<any> {
    return this.userService.findUserById(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() user: any): Promise<UpdateResult> {
    return this.userService.updateUser(id, user);
  }
}
