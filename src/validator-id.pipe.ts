import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidatorId implements PipeTransform<any> {
  transform(id: any) {
    const list = [1, 2];
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException('ID must be a valid integer.');
    }

    if (!list.find((e) => e == id)) {
      return 0;
    }

    return Number(id);
  }
}
