import { ExecutionContext } from '@nestjs/common';
import { InternalTokenGuard } from './internal-token.guard';

const makeCtx = (token?: string) =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({
        headers: token ? { 'x-internal-token': token } : {},
      }),
    }),
  }) as unknown as ExecutionContext;

describe('InternalTokenGuard', () => {
  beforeEach(() => {
    process.env.INTERNAL_SERVICE_TOKEN = 'test-secret';
  });

  it('rejects request with no token', () => {
    const guard = new InternalTokenGuard();
    expect(guard.canActivate(makeCtx())).toBe(false);
  });

  it('rejects request with wrong token', () => {
    const guard = new InternalTokenGuard();
    expect(guard.canActivate(makeCtx('wrong'))).toBe(false);
  });

  it('passes request with correct token', () => {
    const guard = new InternalTokenGuard();
    expect(guard.canActivate(makeCtx('test-secret'))).toBe(true);
  });
});
