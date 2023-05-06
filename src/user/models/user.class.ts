import { IsEmail, IsString } from 'class-validator';
import { Role } from './role.enum';

export class User {
  id?: number;
  name?:string;
  trelloId?: string;
  username: string;
  @IsEmail()
  email: string;
  @IsString()
  password?: string;
  role?: Role;
}
