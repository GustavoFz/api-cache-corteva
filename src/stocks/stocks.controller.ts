import { Controller, Get, Param } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller()
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get(':id/:dateStart/:dateEnd')
  findOne(
    @Param('id') id: string,
    @Param('dateStart') dateStart: string,
    @Param('dateEnd') dateEnd: string,
  ) {
    return this.stocksService.findOne(+id, dateStart, dateEnd);
  }
}
