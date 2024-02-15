import { Module } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, DbService],
})
export class CompaniesModule {}
