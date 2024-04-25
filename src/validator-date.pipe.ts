import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValid } from 'date-fns';

@Injectable()
export class ValidatorDate implements PipeTransform<any> {
  transform(date: any) {
    const r = /^\d{4}-\d{2}-\d{2}$/;

    if (!date) {
      throw new BadRequestException(
        'Both dateStart and dateEnd are required if specified.',
      );
    }

    if (!isValid(new Date(date)) || !r.test(date)) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }

    return String(date);
  }
}
