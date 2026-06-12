import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  findAll(ownerId: string): Promise<TaskDocument[]> {
    return this.taskModel.find({ ownerId }).sort({ createdAt: -1 }).exec();
  }

  create(dto: CreateTaskDto, ownerId: string): Promise<TaskDocument> {
    return this.taskModel.create({ ...dto, ownerId, status: 'todo' });
  }

  async update(id: string, dto: UpdateTaskDto, ownerId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException('Task not found');
    if (task.ownerId !== ownerId) throw new ForbiddenException();
    Object.assign(task, dto);
    return task.save();
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException('Task not found');
    if (task.ownerId !== ownerId) throw new ForbiddenException();
    await task.deleteOne();
  }
}
