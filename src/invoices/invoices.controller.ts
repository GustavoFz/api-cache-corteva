import { Controller, Get, Param } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get(':id/:dateStart/:dateEnd')
  findOne(
    @Param('id') id: string,
    @Param('dateStart') dateStart: string,
    @Param('dateEnd') dateEnd: string,
  ) {
    return this.invoicesService.findOne(+id, dateStart, dateEnd);
  }
}
