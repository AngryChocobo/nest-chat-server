import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { User } from './user.model';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return this.usersService.login(loginUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Post('register')
  @ApiOperation({ summary: '注册用户' })
  register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.usersService.register(registerUserDto);
  }
}
