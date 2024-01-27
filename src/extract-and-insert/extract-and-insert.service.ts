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
  async selectAndInput(tableInput: any, select: any, columnsUpdate: any) {
    try {
      const rows = await this.db.query(select);
      console.log('Consulta Empresa Realizada');

      const columns = Object.keys(rows[0]);
      const values = rows.map((row: any) =>
        columns.map((column) => row[column]),
      );
      console.log(rows);

      const connection = await mysql.createConnection(this.targetDbConfig);
      await connection.query(
        `INSERT INTO ${tableInput} (${columns.join(
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

  async selectAndInputMov(tableInput: any, select: any) {
    try {
      const rows = await this.db.query(select);
      console.log('Consulta Empresa Realizada');

      const regex = new RegExp('^([A-Z]+)([0-9]+)');

      rows.map((objeto: any) => {
        const match = regex.exec(objeto.numDocto);

        if (!objeto.serieFiscal) {
          objeto.serieFiscal = 1;
        }

        if (!match) {
          throw new InternalServerErrorException('Erro no regex');
        }
        delete objeto.numDocto;
        objeto.tipoNota = match[1];
        objeto.numeroNota = match[2];
      });

      const columns = Object.keys(rows[0]);
      const values = rows.map((row: any) =>
        columns.map((column) => row[column]),
      );

      const connection = await mysql.createConnection(this.targetDbConfig);
      await connection.query(
        `REPLACE INTO ${tableInput} (${columns.join(',')}) VALUES ?`,
        [values],
      );
      connection.end();
      console.log('REPLACE Empresa Realizado com sucesso');
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  onModuleInit() {
    this.selectAndInput(
      'notaSaida',
      'SELECT nota.id, nota.codPedido, nota.codEmpresa, nota.numero, nota.codSerie, nota.dataEmissao, nota.codCondVenda, nota.CondicaoDeVenda->descricao, nota.codTipoDeNota, %ODBCOUT(nota.codTipoDeNota->tipoFinalNfe+1) AS codTipoDeNota, %EXTERNAL(nota.codTipoDeNota->tipoFinalNfe) AS DescTipoDeNota, nota.situacao, nota.codNatOperacao, nota.codCliente, nota.codRepresentante, nota.Representante->nome AS nomeRepresentante, nota.Representante->cnpjcpf AS cnpjcpfRepresentante FROM fat.notafiscal AS nota WHERE nota.codEmpresa IN (1,2) AND nota.codTipoDeNota->tipoFinalNfe!="" AND nota.dataEmissao>=DATE("2017-01-01")',
      'situacao=VALUES(situacao)',
    );
  }

  @Cron(CronExpression.EVERY_HOUR)
  async processData(): Promise<void> {
    try {
      this.selectAndInput(
        'empresa',
        'SELECT empresa.id AS id, empresa.cnpjCpf AS cnpjCpf, empresa.nome AS razaoSocial, COALESCE(empresa.fantasia, "") AS nomeFantasia, empresa.cep AS cep, empresa.endereco, %EXTERNAL(empresa.numEmpLogradouro) AS numeroEndereco, empresa.bairro, empresa.nomeCidade AS cidade, empresa.estado, ibge.codIBGE AS codigoIbge, empresa.telefone, COALESCE(empresa.dataRegistro, DATE("2000-01-01")) AS dataRegistro, empresa.situacao AS situacao FROM cad.empresa AS empresa JOIN cad.cidade AS ibge ON ibge.ID=SUBSTRING(empresa.cep,1,5)',
        'telefone=VALUES(telefone), situacao=VALUES(situacao)',
      );
      this.selectAndInput(
        'fornecedor',
        'SELECT fornecedor.id AS id, fornecedor.codigo, fornecedor.codEmpresa, fornecedor.cnpjCpf AS cnpjCpf, fornecedor.inscEstadual, fornecedor.nome AS razaoSocial, COALESCE(fornecedor.fantasia, "") AS nomeFantasia, fornecedor.cep AS cep, fornecedor.endereco, fornecedor.nroEndereco AS numeroEndereco, fornecedor.bairro, fornecedor.nomeCidade AS cidade, fornecedor.siglaEstado AS estado, ibge.codIBGE AS codigoIbge, COALESCE(fornecedor.telefone, fornecedor.telefone1) AS telefone, fornecedor.email, COALESCE(fornecedor.dataSituacao, DATE("2000-01-01")) AS dataRegistro FROM cpg.fornecedor AS fornecedor JOIN cad.cidade AS ibge ON ibge.ID=SUBSTRING(fornecedor.cep,1,5) where codEmpresa!=99',
        'telefone=VALUES(telefone), email=VALUES(email)',
      );
      this.selectAndInputMov(
        'movimentacao',
        'select id AS id, numDocto, codEmpresa, codItem, codNatureza1 AS codNatureza, dataLcto AS dataLancamento, (CASE WHEN operacao1="+" THEN 1 ELSE 0 END) AS operacao, qtdMovto AS qtdItem, codUnidEstoque AS uniMedidaItem, serieFiscal from est.movimento where codNatureza1=8 AND tipoPpcp NOT IN (90,91,5) AND codItem IN (SELECT codItem FROM Cgi.MascSaida WHERE {fn LEFT(mascara,2)}="12")',
      );
      console.log('Data processed successfully.');
    } catch (error) {
      console.error('Error processing data:', error);
    }
  }
}
