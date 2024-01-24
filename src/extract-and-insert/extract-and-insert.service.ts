import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as mysql from 'mysql2/promise';
import { DbService } from '../db/db.service';

@Injectable()
export class ExtractAndInsertService {
  constructor(
    private env: ConfigService,
    private db: DbService,
  ) {}

  private readonly targetDbConfig = {
    host: this.env.get<string>('API_MYSQL_HOST'),
    user: this.env.get<string>('API_MYSQL_USER'),
    password: this.env.get<string>('API_MYSQL_PASS'),
    database: this.env.get<string>('API_MYSQL_DATABASE'),
  };
  async selectAndInput(table: any, select: any, columnsUpdate: any) {
    try {
      const rows = await this.db.query(select);
      console.log('Consulta Empresa Realizada');

      const columns = Object.keys(rows[0]);
      const values = rows.map((row: any) =>
        columns.map((column) => row[column]),
      );

      const connection = await mysql.createConnection(this.targetDbConfig);
      await connection.query(
        `INSERT INTO ${table} (${columns.join(
          ',',
        )}) VALUES ? ON DUPLICATE KEY UPDATE ${columnsUpdate}`,
        [values],
      );
      connection.end();
      console.log('Insert/Update Empresa Realizado com sucesso');
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  onModuleInit() {}

  @Cron(CronExpression.EVERY_HOUR)
  async processData(): Promise<void> {
    try {
      this.selectAndInput(
        'empresa',
        'SELECT empresa.id AS id, empresa.cnpjCpf AS cnpjCpf, empresa.nome AS razaoSocial, COALESCE(empresa.fantasia, "") AS nomeFantasia, empresa.cep AS cep, empresa.endereco, %EXTERNAL(empresa.numEmpLogradouro) AS numeroEndereco, empresa.bairro, empresa.nomeCidade AS cidade, empresa.estado, ibge.codIBGE AS codigoIbge, empresa.telefone, COALESCE(empresa.dataRegistro, DATE("2000-01-01")) AS dataRegistro, empresa.situacao AS situacao FROM cad.empresa AS empresa JOIN cad.cidade AS ibge ON ibge.ID=SUBSTRING(empresa.cep,1,5)',
        'telefone=VALUES(telefone), situacao=VALUES(situacao)',
      );
      console.log('Data processed successfully.');
    } catch (error) {
      console.error('Error processing data:', error);
    }
  }
}
