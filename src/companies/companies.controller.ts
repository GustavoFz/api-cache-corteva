import { Controller, Get, Param } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.companiesService.findOne(+id);
  }
}
