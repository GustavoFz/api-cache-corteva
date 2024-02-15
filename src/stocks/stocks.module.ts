import { Module } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';

@Module({
  controllers: [StocksController],
  providers: [StocksService, DbService],
})
export class StocksModule {}
