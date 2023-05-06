import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './models/user.entity';
import { User } from './models/user.class';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  _getUserDetails(user: UserEntity): User {
    return {
      id: user.id,
      name: user.name,
      trelloId: user.trelloId,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  async findAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find({
      select: ['id', 'name', 'trelloId', 'username', 'email', 'role'],
    });
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ id })
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ email });
  }

  async create(
    trelloMemberName: string,
    trelloId: string,
    username: string,
    email: string,
    hashedPassword: string,
  ): Promise<UserEntity> {
    return this.userRepository.save({
      name: trelloMemberName,
      trelloId: trelloId,
      username,
      email,
      password: hashedPassword,
    });
  }

  async updateUser(id: number, user: UserEntity): Promise<UpdateResult> {
    return this.userRepository.update(id, user)
  }
}
