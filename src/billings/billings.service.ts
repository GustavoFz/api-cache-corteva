import { Injectable } from '@nestjs/common';

@Injectable()
export class BillingsService {
  findOne(id: number) {
    return `This action returns a #${id} billing`;
  }
}
