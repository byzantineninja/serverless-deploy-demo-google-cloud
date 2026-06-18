import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Merit, MeritDocument } from './merit.schema';
import { User, UserDocument } from '../users/user.schema';

const ANONYMOUS_NAME = '匿名修行者';

@Injectable()
export class MeritService {
  constructor(
    @InjectModel(Merit.name) private meritModel: Model<MeritDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /** 累積功德，功德 +amount。 */
  async tap(uid: string, amount = 1): Promise<MeritDocument> {
    const user = await this.userModel.findOne({ uid }).exec();
    const displayName = user?.displayName ?? user?.email ?? ANONYMOUS_NAME;

    const doc = await this.meritModel
      .findOneAndUpdate(
        { uid },
        { $inc: { count: amount }, $set: { displayName } },
        { upsert: true, new: true },
      )
      .exec();
    return doc!;
  }

  async findByUid(uid: string): Promise<MeritDocument | null> {
    return this.meritModel.findOne({ uid }).exec();
  }

  /** 功德排行榜：功德高者在前，同分者以先達成者在前。 */
  leaderboard(limit = 20): Promise<MeritDocument[]> {
    return this.meritModel
      .find()
      .sort({ count: -1, updatedAt: 1 })
      .limit(limit)
      .exec();
  }
}
