import { Controller, Get, Param } from '@nestjs/common';
import { ValidatorId } from '../validator-id.pipe';
import { CustomersService } from './customers.service';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get(':id')
  findOne(@Param('id', ValidatorId) id: number) {
    return this.customersService.findOne(id);
  }
}
