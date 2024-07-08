import { Controller, Get, Param } from '@nestjs/common';
import { ValidatorDate } from '../validator-date.pipe';
import { ValidatorId } from '../validator-id.pipe';
import { FaturamentoService } from './faturamento.service';

@Controller()
export class FaturamentoController {
  constructor(private readonly faturamentoService: FaturamentoService) {}

  @Get(':id/:dateStart/:dateEnd')
  findOne(
    @Param('id', ValidatorId) id: number,
    @Param('dateStart', ValidatorDate) dateStart: string,
    @Param('dateEnd', ValidatorDate) dateEnd: string,
  ) {
    return this.faturamentoService.findOne(+id, dateStart, dateEnd);
  }
}
