import { Controller, Get, Param } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(+id);
  }
}
