import { Test, TestingModule } from '@nestjs/testing';
import { SyncResolver } from './sync.resolver';

describe('SyncResolver', () => {
  let resolver: SyncResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SyncResolver],
    }).compile();

    resolver = module.get<SyncResolver>(SyncResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
