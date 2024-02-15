import { Controller, Get, Param } from '@nestjs/common';
import { BillingsService } from './billings.service';

@Controller()
export class BillingsController {
  constructor(private readonly billingsService: BillingsService) {}

  @Get(':id/:dateStart/:dateEnd')
  findOne(
    @Param('id') id: string,
    @Param('dateStart') dateStart: string,
    @Param('dateEnd') dateEnd: string,
  ) {
    return this.billingsService.findOne(+id, dateStart, dateEnd);
  }
}
