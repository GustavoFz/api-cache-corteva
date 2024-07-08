import { Test, TestingModule } from '@nestjs/testing';
import { FaturamentoController } from './faturamento.controller';
import { FaturamentoService } from './faturamento.service';

describe('FaturamentoController', () => {
  let controller: FaturamentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaturamentoController],
      providers: [FaturamentoService],
    }).compile();

    controller = module.get<FaturamentoController>(FaturamentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
