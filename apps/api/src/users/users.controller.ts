import { Body, Controller, Get, Headers, NotFoundException, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  upsert(@Headers('x-user-id') uid: string, @Body() dto: CreateUserDto) {
    return this.usersService.upsert(uid, dto);
  }

  @Get('me')
  async findMe(@Headers('x-user-id') uid: string) {
    const user = await this.usersService.findByUid(uid);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
