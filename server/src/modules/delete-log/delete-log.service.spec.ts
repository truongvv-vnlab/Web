import { Test, TestingModule } from '@nestjs/testing';
import { DeleteLogService } from './delete-log.service';

describe('DeleteLogService', () => {
  let service: DeleteLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteLogService],
    }).compile();

    service = module.get<DeleteLogService>(DeleteLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
