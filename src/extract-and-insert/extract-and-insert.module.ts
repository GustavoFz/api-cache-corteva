import { Module } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { ExtractAndInsertService } from './extract-and-insert.service';

@Module({
  controllers: [],
  providers: [ExtractAndInsertService, DbService],
})
export class ExtractAndInsertModule {}
