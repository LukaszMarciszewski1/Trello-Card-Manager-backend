import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from './../user/user.service';
import { User } from 'src/user/models/user.class';
import { ExistingUserDTO } from 'src/user/models/existing-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: Readonly<User>): Promise<User> {
    const { name, email, password } = user;

    const existingUser = await this.userService.findByEmail(email);

    if (existingUser)
      throw new HttpException(
        'A user has already been created with this email address',
        HttpStatus.CONFLICT,
      );

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await this.userService.create(name, email, hashedPassword);
    return this.userService._getUserDetails(newUser);
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);

    if (!user) return null;

    const doesPasswordMatch = await bcrypt.compare(pass, user.password);

    if (!doesPasswordMatch) return null;

    const { password, ...result } = user;
    return result
  }

  async login(
    existingUser: ExistingUserDTO,
  ): Promise<{ token: string } | null> {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    if (!user)
      throw new HttpException('Invalid credentials!', HttpStatus.UNAUTHORIZED);

    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt };
  }
}
