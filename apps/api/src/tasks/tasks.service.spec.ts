import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { Task } from './task.schema';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getModelToken(Task.name), useValue: {} },
      ],
    }).compile();
    service = module.get(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
