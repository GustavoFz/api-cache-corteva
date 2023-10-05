import { Injectable } from '@nestjs/common';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

@Injectable()
export class BillingsService {
  findOne(id: number) {
    return `This action returns a #${id} billing`;
  }
}
