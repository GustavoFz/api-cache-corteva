import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as mysql from 'mysql2/promise';
import * as odbc from 'odbc';

@Injectable()
export class DbService {
  constructor(private env: ConfigService) {}

  private readonly targetDbConfig = {
    host: this.env.get<string>('API_MYSQL_HOST'),
    user: this.env.get<string>('API_MYSQL_USER'),
    password: this.env.get<string>('API_MYSQL_PASS'),
    database: this.env.get<string>('API_MYSQL_DATABASE'),
  };

  private readonly odbc_config = this.env.get<string>('API_ODBC_CONFIG');

  async cache(sql: string) {
    try {
      const connection = await odbc.connect(this.odbc_config);
      const result = await connection.query(sql);
      await connection.close();
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async mysql(query, values) {
    const connection = await mysql.createConnection(this.targetDbConfig);
    await connection.query(query, values);
    connection.end();
  }
}
