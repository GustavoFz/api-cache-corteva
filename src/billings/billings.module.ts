import { Module } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { BillingsController } from './billings.controller';
import { BillingsService } from './billings.service';

@Module({
  controllers: [BillingsController],
  providers: [BillingsService, DbService],
})
export class BillingsModule {}
