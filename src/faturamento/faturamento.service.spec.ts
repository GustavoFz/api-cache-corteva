import { Test, TestingModule } from '@nestjs/testing';
import { FaturamentoService } from './faturamento.service';

describe('FaturamentoService', () => {
  let service: FaturamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FaturamentoService],
    }).compile();

    service = module.get<FaturamentoService>(FaturamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
