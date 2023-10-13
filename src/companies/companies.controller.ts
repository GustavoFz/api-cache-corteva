import { Controller, Get, Param } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }
}
