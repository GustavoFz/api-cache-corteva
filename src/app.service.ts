import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  apiVersion(): string {
    return 'v1.0';
  }
}
