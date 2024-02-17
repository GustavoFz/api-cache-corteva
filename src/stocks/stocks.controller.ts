import { Controller, Get, Param } from '@nestjs/common';
import { ValidatorDate } from '../validator-date.pipe';
import { ValidatorId } from '../validator-id.pipe';
import { StocksService } from './stocks.service';

@Controller()
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get(':id/:dateStart/:dateEnd')
  findOne(
    @Param('id', ValidatorId) id: number,
    @Param('dateStart', ValidatorDate) dateStart: string,
    @Param('dateEnd', ValidatorDate) dateEnd: string,
  ) {
    return this.stocksService.findOne(+id, dateStart, dateEnd);
  }
}
