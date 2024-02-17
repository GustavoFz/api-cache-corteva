import { Controller, Get, Param } from '@nestjs/common';
import { ValidatorDate } from '../validator-date.pipe';
import { ValidatorId } from '../validator-id.pipe';
import { BillingsService } from './billings.service';

@Controller()
export class BillingsController {
  constructor(private readonly billingsService: BillingsService) {}

  @Get(':id/:dateStart/:dateEnd')
  findOne(
    @Param('id', ValidatorId) id: number,
    @Param('dateStart', ValidatorDate) dateStart: string,
    @Param('dateEnd', ValidatorDate) dateEnd: string,
  ) {
    return this.billingsService.findOne(id, dateStart, dateEnd);
  }
}
