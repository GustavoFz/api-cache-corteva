import { Module } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { FaturamentoController } from './faturamento.controller';
import { FaturamentoService } from './faturamento.service';

@Module({
  controllers: [FaturamentoController],
  providers: [FaturamentoService, DbService],
})
export class FaturamentoModule {}
