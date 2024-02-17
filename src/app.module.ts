import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillingsModule } from './billings/billings.module';
import { CompaniesModule } from './companies/companies.module';
import { CustomersModule } from './customers/customers.module';
import { DbModule } from './db/db.module';
import { ExtractAndInsertModule } from './extract-and-insert/extract-and-insert.module';
import { InvoicesModule } from './invoices/invoices.module';
import { StocksModule } from './stocks/stocks.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    StocksModule,
    DbModule,
    InvoicesModule,
    BillingsModule,
    CustomersModule,
    CompaniesModule,
    ExtractAndInsertModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RouterModule.register([
      {
        path: 'api/rical',
        module: AppModule,
        children: [
          {
            path: 'sendBilling',
            module: BillingsModule,
          },
          {
            path: 'sendDistributor',
            module: CompaniesModule,
          },

          {
            path: 'sendCliAndProp',
            module: CustomersModule,
          },
          {
            path: 'sendInvoice',
            module: InvoicesModule,
          },
          {
            path: 'sendStock',
            module: StocksModule,
          },
        ],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
