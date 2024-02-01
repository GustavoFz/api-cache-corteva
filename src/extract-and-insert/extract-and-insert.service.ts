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
      'itemNotaSaida',
      'SELECT item.id, item.codEmpresa, TO_NUMBER(item.numero) AS numeroNota, item.codProduto AS codItem, item.codProduto->nome as nomeItem, item.vlrItem AS vlrItem, item.precoUnitarioFloat AS vlrUnitarioItem, item.qtdeFaturada AS qtdItem, item.codProduto->unidadeMedida AS unidMedida, item.vlrDesconto, item.codClassifFiscal->classificacaoFiscal AS ncm, item.vlrCOFINSProp AS vlrCofins, item.vlrICMS AS vlrIcms, item.vlrPISProp AS vlrPis, item.vlrTriNFC AS vlrTributoNfc, item.dataEmissao FROM fat.NotaFiscalItem AS item WHERE item.codEmpresa IN (1,2) AND ISNUMERIC(item.codProduto)=1 AND item.dataEmissao>=DATE("2017-01-01")',
      'qtdItem=VALUES(qtdItem)',
    );
  }

  @Cron(CronExpression.EVERY_HOUR)
  async processData(): Promise<void> {
    try {
      //EMPRESA
      this.selectAndInput(
        'empresa',
        'SELECT empresa.id AS id, empresa.cnpjCpf AS cnpjCpf, empresa.nome AS razaoSocial, COALESCE(empresa.fantasia, "") AS nomeFantasia, empresa.cep AS cep, empresa.endereco, %EXTERNAL(empresa.numEmpLogradouro) AS numeroEndereco, empresa.bairro, empresa.nomeCidade AS cidade, empresa.estado, ibge.codIBGE AS codigoIbge, empresa.telefone, COALESCE(empresa.dataRegistro, DATE("2000-01-01")) AS dataRegistro, empresa.situacao AS situacao FROM cad.empresa AS empresa JOIN cad.cidade AS ibge ON ibge.ID=SUBSTRING(empresa.cep,1,5)',
        'telefone=VALUES(telefone), situacao=VALUES(situacao)',
      );
      //FORNECEDOR
      this.selectAndInput(
        'fornecedor',
        'SELECT fornecedor.id AS id, fornecedor.codigo, fornecedor.codEmpresa, fornecedor.cnpjCpf AS cnpjCpf, fornecedor.inscEstadual, fornecedor.nome AS razaoSocial, COALESCE(fornecedor.fantasia, "") AS nomeFantasia, fornecedor.cep AS cep, fornecedor.endereco, fornecedor.nroEndereco AS numeroEndereco, fornecedor.bairro, fornecedor.nomeCidade AS cidade, fornecedor.siglaEstado AS estado, ibge.codIBGE AS codigoIbge, COALESCE(fornecedor.telefone, fornecedor.telefone1) AS telefone, fornecedor.email, COALESCE(fornecedor.dataSituacao, DATE("2000-01-01")) AS dataRegistro FROM cpg.fornecedor AS fornecedor JOIN cad.cidade AS ibge ON ibge.ID=SUBSTRING(fornecedor.cep,1,5) where codEmpresa!=99',
        'telefone=VALUES(telefone), email=VALUES(email)',
      );
      //NOTA DE SAIDA
      this.selectAndInput(
        'notaSaida',
        'SELECT nota.id, TO_NUMBER(nota.codPedido) AS codPedido, nota.codEmpresa, nota.numero, nota.codSerie, chave.chaveAcesso AS chave, nota.dataEmissao, nota.codCondVenda, nota.CondicaoDeVenda->descricao, nota.codTipoDeNota, %ODBCOUT(nota.codTipoDeNota->tipoFinalNfe+1) AS codTipoDeNota, %EXTERNAL(nota.codTipoDeNota->tipoFinalNfe) AS DescTipoDeNota, nota.situacao, nota.codNatOperacao, nota.Cliente AS idCliente, nota.codCliente, nota.codRepresentante, nota.Representante->nome AS nomeRepresentante, nota.Representante->cnpjcpf AS cnpjcpfRepresentante FROM fat.notafiscal AS nota JOIN Fat.NotaFiscalComp2 AS chave ON chave.ID=nota.ID WHERE nota.codEmpresa IN (1,2) AND nota.codTipoDeNota->tipoFinalNfe!="" AND chave.chaveAcesso!="" AND nota.dataEmissao>=DATE("2017-01-01")',
        'situacao=VALUES(situacao)',
      );
      //NOTA DE ENTRADA
      this.selectAndInput(
        'notaEntrada',
        'SELECT nota.id, nota.codEmpresa, TO_NUMBER(nota.numDocumento) AS numero, nota.codSerie, nota.dataEmissao, nota.condPgto AS condPagamento, %ODBCOUT(nota.especieDocumento) AS codTipoDeNota, %EXTERNAL(nota.especieDocumento) AS descTipoDeNota, STRING(nota.codEmpresa, "||", nota.fornecedor) AS idFornecedor, nota.fornecedor AS codFornecedor, naturezaOperacao, STRING(chave.chavenfe) AS chave FROM est.notafiscalentrada AS nota JOIN est.NotaFiscalEntradaChavElet AS chave ON nota.codEmpresa=chave.codEmpresa AND nota.numDocumento=chave.numDocumento AND nota.codSerie=chave.codSerie AND nota.fornecedor=chave.fornecedor WHERE nota.codEmpresa IN (1,2) AND nota.dataEmissao>=DATE("2017-01-01")',
        'condPagamento=VALUES(condPagamento)',
      );
      //MOVIMENTACAO DE ESTOQUE
      this.selectAndInputMov(
        'movimentacao',
        'select id AS id, numDocto, codEmpresa, codItem, codNatureza1 AS codNatureza, dataLcto AS dataLancamento, (CASE WHEN operacao1="+" THEN 1 ELSE 0 END) AS operacao, qtdMovto AS qtdItem, codUnidEstoque AS uniMedidaItem, serieFiscal from est.movimento where codNatureza1=8 AND tipoPpcp NOT IN (90,91,5) AND codItem IN (SELECT codItem FROM Cgi.MascSaida WHERE {fn LEFT(mascara,2)}="12")',
      );
      //ITEM NOTA FISCAL DE SAIDA
      this.selectAndInput(
        'itemNotaSaida',
        'SELECT item.id, item.codEmpresa, TO_NUMBER(item.numero) AS numeroNota, item.codProduto AS codItem, item.codProduto->nome as nomeItem, item.vlrItem AS vlrItem, item.precoUnitarioFloat AS vlrUnitarioItem, item.qtdeFaturada AS qtdItem, item.codProduto->unidadeMedida AS unidMedida, item.vlrDesconto, item.codClassifFiscal->classificacaoFiscal AS ncm, item.vlrCOFINSProp AS vlrCofins, item.vlrICMS AS vlrIcms, item.vlrPISProp AS vlrPis, item.vlrTriNFC AS vlrTributoNfc, item.dataEmissao FROM fat.NotaFiscalItem AS item WHERE item.codEmpresa IN (1,2) AND ISNUMERIC(item.codProduto)=1 AND item.dataEmissao>=DATE("2017-01-01")',
        'qtdItem=VALUES(qtdItem)',
      );
      //ITEM NOTA FICAL DE ENTRADA
      this.selectAndInput(
        'itemNotaEntrada',
        'SELECT item.id, item.codEmpresa, TO_NUMBER(item.numDocumento) AS numeroNota, TO_NUMBER(item.codMaterial) AS codItem, item.codMaterial->nome as nomeItem, item.valorTotalItem AS vlrItem, CAST((item.valorTotalItem/item.quantidade) AS NUMERIC(18,4)) AS vlrUnitarioItem, item.quantidade AS qtdItem, item.codMaterial->unidadeMedida AS unidMedida, 0 AS vlrDesconto, STRING(item.classificacaoFiscal) AS ncm, item.ValorCOFINS AS vlrCofins, item.valorICMS AS vlrIcms, item.valorPisPasepRec AS vlrPis, item.valorIPI AS vlrIpi, item.dataEntrada FROM est.NotaFiscalEntradaItens AS item WHERE item.codEmpresa IN (1,2) AND item.quantidade>=1 AND ISNUMERIC(item.codMaterial)=1 AND item.dataEntrada>=DATE("2017-01-01")',
        'qtdItem=VALUES(qtdItem)',
      );
      console.log('Data processed successfully.');
    } catch (error) {
      console.error('Error processing data:', error);
    }
  }
}
