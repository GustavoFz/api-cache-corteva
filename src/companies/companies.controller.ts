import { Controller, Get, Param } from '@nestjs/common';
import { ValidatorId } from '../validator-id.pipe';
import { CompaniesService } from './companies.service';

@Controller()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get(':id')
  findOne(@Param('id', ValidatorId) id: number) {
    return this.companiesService.findOne(id);
  }
}
