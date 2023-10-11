import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  imports: [ConfigModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
