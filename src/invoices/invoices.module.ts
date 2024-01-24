import { Module } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService, DbService],
})
export class InvoicesModule {}
