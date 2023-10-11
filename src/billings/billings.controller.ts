import { Controller, Get, Param } from '@nestjs/common';
import { BillingsService } from './billings.service';

@Controller()
export class BillingsController {
  constructor(private readonly billingsService: BillingsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billingsService.findOne(+id);
  }
}
