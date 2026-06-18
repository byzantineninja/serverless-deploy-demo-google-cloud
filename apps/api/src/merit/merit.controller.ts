import {
  Controller, Get, Post,
  Headers, Query, UnauthorizedException,
} from '@nestjs/common';
import { MeritService } from './merit.service';

const MAX_LEADERBOARD = 100;

@Controller('merit')
export class MeritController {
  constructor(private readonly meritService: MeritService) {}

  // 公開端點 — 不需登入即可查看功德排行榜
  @Get('leaderboard')
  leaderboard(@Query('limit') limit?: string) {
    const parsed = limit ? parseInt(limit, 10) : 20;
    const n = Math.min(Number.isFinite(parsed) && parsed > 0 ? parsed : 20, MAX_LEADERBOARD);
    return this.meritService.leaderboard(n);
  }

  @Get('me')
  async findMe(@Headers('x-user-id') uid: string) {
    if (!uid) throw new UnauthorizedException();
    const merit = await this.meritService.findByUid(uid);
    return merit ?? { uid, displayName: '', count: 0 };
  }

  @Post('tap')
  tap(@Headers('x-user-id') uid: string) {
    if (!uid) throw new UnauthorizedException();
    return this.meritService.tap(uid);
  }
}
