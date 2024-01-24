import { Test, TestingModule } from '@nestjs/testing';
import { ExtractAndInsertService } from './extract-and-insert.service';

describe('ExtractAndInsertService', () => {
  let service: ExtractAndInsertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtractAndInsertService],
    }).compile();

    service = module.get<ExtractAndInsertService>(ExtractAndInsertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
