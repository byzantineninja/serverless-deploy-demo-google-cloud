import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MeritService } from './merit.service';
import { Merit } from './merit.schema';
import { User } from '../users/user.schema';

describe('MeritService', () => {
  let service: MeritService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MeritService,
        { provide: getModelToken(Merit.name), useValue: {} },
        { provide: getModelToken(User.name), useValue: {} },
      ],
    }).compile();
    service = module.get(MeritService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
