import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillingsModule } from './billings/billings.module';
import { CompaniesModule } from './companies/companies.module';
import { CustomersModule } from './customers/customers.module';
import { GlobalhttpmoduleModule } from './globalhttpmodule/globalhttpmodule.module';
import { InvoicesModule } from './invoices/invoices.module';
import { StocksModule } from './stocks/stocks.module';

@Module({
  imports: [
    StocksModule,
    InvoicesModule,
    BillingsModule,
    CustomersModule,
    GlobalhttpmoduleModule,
    CompaniesModule,
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
