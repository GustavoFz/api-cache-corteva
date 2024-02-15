import { Module } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, DbService],
})
export class CustomersModule {}
