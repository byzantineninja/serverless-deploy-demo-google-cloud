import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Headers, UseGuards, HttpCode,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InternalTokenGuard } from '../common/guards/internal-token.guard';

@Controller('tasks')
@UseGuards(InternalTokenGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Headers('x-user-id') userId: string) {
    return this.tasksService.findAll(userId);
  }

  @Post()
  create(@Body() dto: CreateTaskDto, @Headers('x-user-id') userId: string) {
    return this.tasksService.create(dto, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.tasksService.update(id, dto, userId);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string, @Headers('x-user-id') userId: string) {
    return this.tasksService.remove(id, userId);
  }
}
