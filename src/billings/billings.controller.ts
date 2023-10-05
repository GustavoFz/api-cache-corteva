import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BillingsService } from './billings.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

@Controller('billings')
export class BillingsController {
  constructor(private readonly billingsService: BillingsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billingsService.findOne(+id);
  }

}
