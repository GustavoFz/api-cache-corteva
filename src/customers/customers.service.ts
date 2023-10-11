import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomersService {
  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }
}
