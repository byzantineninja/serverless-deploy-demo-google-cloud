import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Merit, MeritSchema } from './merit.schema';
import { User, UserSchema } from '../users/user.schema';
import { MeritService } from './merit.service';
import { MeritController } from './merit.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Merit.name, schema: MeritSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [MeritController],
  providers: [MeritService],
})
export class MeritModule {}
