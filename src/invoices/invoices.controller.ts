import { Controller, Get, Param } from '@nestjs/common';
import { ValidatorDate } from '../validator-date.pipe';
import { ValidatorId } from '../validator-id.pipe';
import { InvoicesService } from './invoices.service';

@Controller()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get(':id/:dateStart/:dateEnd')
  findOne(
    @Param('id', ValidatorId) id: number,
    @Param('dateStart', ValidatorDate) dateStart: string,
    @Param('dateEnd', ValidatorDate) dateEnd: string,
  ) {
    return this.invoicesService.findOne(+id, dateStart, dateEnd);
  }
}
