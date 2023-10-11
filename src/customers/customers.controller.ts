import { Controller, Get, Param } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }
}
