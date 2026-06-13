import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async upsert(uid: string, dto: CreateUserDto): Promise<User> {
    const doc = await this.userModel
      .findOneAndUpdate(
        { uid },
        { $set: { email: dto.email, ...(dto.displayName && { displayName: dto.displayName }) } },
        { upsert: true, new: true },
      )
      .exec();
    return doc!;
  }

  async findByUid(uid: string): Promise<User | null> {
    return this.userModel.findOne({ uid }).exec();
  }
}
