import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillingsModule } from './billings/billings.module';
import { InvoicesModule } from './invoices/invoices.module';
import { StocksModule } from './stocks/stocks.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [StocksModule, InvoicesModule, BillingsModule, CustomersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
