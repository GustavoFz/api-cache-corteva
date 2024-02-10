import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DbService } from '../db/db.service';

@Injectable()
export class ExtractAndInsertService {
  constructor(private db: DbService) {}

  async selectAndInputUpdate(tableInput: any, select: any, columnsUpdate: any) {
    try {
      const rows = await this.db.cache(select);
      console.log(`Consulta realizada com sucesso na tabela ${tableInput}`);

      const columns = Object.keys(rows[0]);
      const values = rows.map((row: any) =>
        columns.map((column) => row[column]),
      );

      await this.db.mysql(
        `INSERT INTO ${tableInput} (${columns.join(
          ',',
        )}) VALUES ? ON DUPLICATE KEY UPDATE ${columnsUpdate}`,
        [values],
      );
      console.log(`Inserção realizada com sucesso na tabela ${tableInput}`);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
  async selectAndInput(tableInput: any, select: any) {
    try {
      const rows = await this.db.cache(select);
      console.log(`Consulta realizada com sucesso na tabela ${tableInput}`);

      const columns = Object.keys(rows[0]);
      const values = rows.map((row: any) =>
        columns.map((column) => row[column]),
      );

      await this.db.mysql(
        `INSERT IGNORE INTO ${tableInput} (${columns.join(',')}) VALUES ?`,
        [values],
      );
      console.log(`Inserção realizada com sucesso na tabela ${tableInput}`);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
  async selectAndInputItem(tableInput: any, select: any) {
    try {
      const rows = await this.db.cache(select);
      console.log(`Consulta realizada com sucesso na tabela ${tableInput}`);

      const produtosCorteva = [
        'Acapela',
        'Accent',
        'Aproach',
        'Bim Max',
        'Classic',
        'Clincher',
        'Closer',
        'Coact',
        'Curathane',
        'Curavial',
        'Curzate',
        'DMA',
        'Delegate',
        'Dermacor',
        'DisparoUltra',
        'Dithane',
        'Dominum',
        'Dontor',
        'Enlist',
        'Equation',
        'Exalt',
        'Expedition',
        'Fore',
        'Front',
        'Garlon',
        'Glizmax',
        'Goal',
        'Inlayon',
        'Intrepid',
        'Jaguar',
        'Kocide',
        'Lannate',
        'Loyant',
        'Lumialza',
        'Midas',
        'Missil',
        'Omsugo',
        'Oranis',
        'Outliner',
        'Pacto',
        'Padron',
        'PalaceUltra',
        'Panoramic',
        'Paxeo',
        'PlanadorXT',
        'Pulsor',
        'Raster',
        'Relicta',
        'Revolux',
        'Ricer',
        'Savey',
        'Scorpion',
        'Sector',
        'Spider',
        'Spindle',
        'Stopper',
        'StopperXT',
        'Success',
        'Talento',
        'Tezpetix',
        'Tordon',
        'Tracer',
        'Tricea',
        'TronadorUltra',
        'Trueno',
        'Truper',
        'Utrisha',
        'Verdict',
        'Verter',
        'Vessarya',
        'Viovan',
        'Volcane',
        'Zorvec',
      ];

      rows.map((objeto: any) => {
        objeto.marcaItem = null;

        for (let i = 0; i < produtosCorteva.length; i++) {
          const regex = new RegExp(`${produtosCorteva[i]}`, 'mi');
          const marca = regex.test(objeto.nomeItem);

          if (marca) {
            objeto.marcaItem = 'CORTEVA';
            break;
          }
        }
      });

      const columns = Object.keys(rows[0]);
      const values = rows.map((row: any) =>
        columns.map((column) => row[column]),
      );

      await this.db.mysql(
        `REPLACE INTO ${tableInput} (${columns.join(',')}) VALUES ?`,
        [values],
      );
      console.log(`Inserção realizada com sucesso na tabela ${tableInput}`);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
  async selectAndInputMov(tableInput: any, select: any) {
    try {
      const rows = await this.db.cache(select);
      console.log(`Consulta realizada com sucesso na tabela ${tableInput}`);

      const regex = new RegExp('^([A-Z]+)([0-9]+)');

      rows.map((objeto: any) => {
        const match = regex.exec(objeto.numDocto);

        if (!objeto.serieFiscal) {
          objeto.serieFiscal = 1;
        }

        if (match) {
          delete objeto.numDocto;
          objeto.tipoNota = match[1];
          objeto.numeroNota = match[2];
        } else {
          objeto.tipoNota = 'AAAAAA';
          objeto.numeroNota = 1111111;
          //throw new InternalServerErrorException('Erro no regex');
        }
      });

      const columns = Object.keys(rows[0]);
      const values = rows.map((row: any) =>
        columns.map((column) => row[column]),
      );

      await this.db.mysql(
        `REPLACE INTO ${tableInput} (${columns.join(',')}) VALUES ?`,
        [values],
      );

      console.log(`Inserção realizada com sucesso na tabela ${tableInput}`);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  // onModuleInit() {
  //   this.processData();
  // }

  @Cron('0 7-19/2 * * 1-6', {
    name: 'Atualização',
    timeZone: 'America/Porto_Velho',
  })
  async processData(): Promise<void> {
    try {
      //EMPRESA
      await this.selectAndInputUpdate(
        'empresa',
        'SELECT empresa.id AS id, empresa.cnpjCpf AS cnpjCpf, empresa.nome AS razaoSocial, COALESCE(empresa.fantasia, "") AS nomeFantasia, empresa.cep AS cep, empresa.endereco, %EXTERNAL(empresa.numEmpLogradouro) AS numeroEndereco, empresa.bairro, empresa.nomeCidade AS cidade, empresa.estado, ibge.codIBGE AS codigoIbge, empresa.telefone, "sac@rical.com.br" AS email, COALESCE(empresa.dataRegistro, DATE("2000-01-01")) AS dataRegistro, empresa.situacao AS situacao FROM cad.empresa AS empresa JOIN cad.cidade AS ibge ON ibge.ID=SUBSTRING(empresa.cep,1,5)',
        'telefone=VALUES(telefone), email=VALUES(email), situacao=VALUES(situacao)',
      );
      //CLIENTE
      await this.selectAndInputUpdate(
        'cliente',
        'SELECT cliente.id AS id, cliente.codCliente, cliente.codEmpresa, cliente.cnpjCpf AS cnpjCpf, cliente.inscEstadual AS inscEstadual, cliente.nome AS razaoSocial, COALESCE(cliente.fantasia, "") AS nomeFantasia, cliente.cep AS cep, cliente.endereco, %EXTERNAL(cliente.enderecoNumero) AS numeroEndereco, cliente.bairro, cliente.nomeCidade AS cidade, cliente.nomeEstado AS estado, ibge.codIBGE AS codigoIbge, COALESCE(compl.telefone, compl.telexCelular, compl.fax) AS telefone, cliente.email AS email, %ODBCOUT(COALESCE(cliente.dataAlterSituacao, compl2.dataAlter)) AS dataRegistro, (CASE wHEN cliente.situacao=1 THEN 1 ELSE 0 END) AS situacao FROM fat.cliente AS cliente JOIN cad.cidade AS ibge ON ibge.ID=SUBSTRING(cliente.cep,1,5) JOIN Fat.CliComplemento2 AS compl ON cliente.ID=compl.ID JOIN Fat.CliComplemento3 AS compl2 ON cliente.id=compl2.ID',
        'telefone=VALUES(telefone), email=VALUES(email), situacao=VALUES(situacao)',
      );
      //FORNECEDOR
      await this.selectAndInputUpdate(
        'fornecedor',
        'SELECT fornecedor.id AS id, fornecedor.codigo, fornecedor.codEmpresa, fornecedor.cnpjCpf AS cnpjCpf, fornecedor.inscEstadual, fornecedor.nome AS razaoSocial, COALESCE(fornecedor.fantasia, "") AS nomeFantasia, fornecedor.cep AS cep, fornecedor.endereco, fornecedor.nroEndereco AS numeroEndereco, fornecedor.bairro, fornecedor.nomeCidade AS cidade, fornecedor.siglaEstado AS estado, ibge.codIBGE AS codigoIbge, COALESCE(fornecedor.telefone, fornecedor.telefone1) AS telefone, fornecedor.email, COALESCE(fornecedor.dataSituacao, DATE("2000-01-01")) AS dataRegistro FROM cpg.fornecedor AS fornecedor JOIN cad.cidade AS ibge ON ibge.ID=SUBSTRING(fornecedor.cep,1,5) where codEmpresa!=99',
        'telefone=VALUES(telefone), email=VALUES(email)',
      );
      //NOTA DE SAIDA
      await this.selectAndInput(
        'notaSaida',
        'SELECT nota.id, TO_NUMBER(nota.codPedido) AS codPedido, nota.codEmpresa, nota.numero, nota.codSerie, nota.codTipoDeNota->descricao AS descricao, chave.chaveAcesso AS chave, nota.dataEmissao, nota.codCondVenda, nota.CondicaoDeVenda->descricao AS condVebdaDescricao, nota.codTipoDeNota, %ODBCOUT(nota.codTipoDeNota->tipoFinalNfe+1) AS codTipoDeNota, %EXTERNAL(nota.codTipoDeNota->tipoFinalNfe) AS descTipoDeNota, nota.situacao, nota.codNatOperacao AS cfop, nota.Cliente AS idCliente, nota.codCliente, nota.codRepresentante, nota.Representante->nome AS nomeRepresentante, nota.Representante->cnpjcpf AS cnpjcpfRepresentante FROM fat.notafiscal AS nota JOIN Fat.NotaFiscalComp2 AS chave ON chave.ID=nota.ID WHERE nota.codEmpresa IN (1,2) AND nota.codTipoDeNota->tipoFinalNfe!="" AND chave.chaveAcesso!="" AND nota.dataEmissao>=DATE("2017-01-01")',
      );

      //NOTA DE ENTRADA
      await this.selectAndInput(
        'notaEntrada',
        'SELECT nota.id, nota.codEmpresa, TO_NUMBER(nota.numDocumento) AS numero, nota.codSerie, nota.naturezaOperacao->nome AS descricao, nota.dataEmissao, nota.dataEntrada, nota.condPgto AS condPagamento, %ODBCOUT(nota.especieDocumento) AS codTipoDeNota, %EXTERNAL(nota.especieDocumento) AS descTipoDeNota, STRING(nota.codEmpresa, "||", nota.fornecedor) AS idFornecedor, nota.fornecedor AS codFornecedor, naturezaOperacao AS cfop, STRING(chave.chavenfe) AS chave FROM est.notafiscalentrada AS nota JOIN est.NotaFiscalEntradaChavElet AS chave ON nota.codEmpresa=chave.codEmpresa AND nota.numDocumento=chave.numDocumento AND nota.codSerie=chave.codSerie AND nota.fornecedor=chave.fornecedor WHERE nota.codEmpresa IN (1,2) AND nota.dataEmissao>=DATE("2017-01-01")',
      );

      //ITEM NOTA FISCAL DE SAIDA
      await this.selectAndInputItem(
        'itemNotaSaida',
        'SELECT item.id, item.codEmpresa, TO_NUMBER(item.numero) AS numeroNota, item.codProduto AS codItem, item.codProduto->nome as nomeItem, item.vlrItem AS vlrItem, item.precoUnitarioFloat AS vlrUnitarioItem, item.qtdeFaturada AS qtdItem, item.codProduto->unidadeMedida AS unidMedida, item.vlrDesconto, item.codClassifFiscal->classificacaoFiscal AS ncm, item.vlrCOFINSProp AS vlrCofins, item.vlrICMS AS vlrIcms, item.vlrPISProp AS vlrPis, item.vlrTriNFC AS vlrTributoNfc, item.dataEmissao FROM fat.NotaFiscalItem AS item WHERE item.codEmpresa IN (1,2) AND ISNUMERIC(item.codProduto)=1 AND item.dataEmissao>=DATE("2017-01-01")',
      );
      //ITEM NOTA FICAL DE ENTRADA
      await this.selectAndInputItem(
        'itemNotaEntrada',
        'SELECT item.id, item.codEmpresa, item.codFornecedor, TO_NUMBER(item.numDocumento) AS numeroNota, item.codSerie AS serieNota, TO_NUMBER(item.codMaterial) AS codItem, item.codMaterial->nome as nomeItem, item.custoEntrada AS vlrEntrada, item.valorTotalItem AS vlrItem, CAST((item.valorTotalItem/item.quantidade) AS NUMERIC(18,4)) AS vlrUnitarioItem, item.quantidade AS qtdItem, item.codMaterial->unidadeMedida AS unidMedida, 0 AS vlrDesconto, STRING(item.classificacaoFiscal) AS ncm, item.naturezaOperacao AS cfop, item.naturezaOperacao->nome AS cfopDescricao, item.ValorCOFINS AS vlrCofins, item.valorICMS AS vlrIcms, item.valorPisPasepRec AS vlrPis, item.valorIPI AS vlrIpi, item.dataEntrada FROM est.NotaFiscalEntradaItens AS item WHERE item.codEmpresa IN (1,2) AND item.quantidade>=1 AND ISNUMERIC(item.codMaterial)=1 AND item.dataEntrada>=DATE("2017-01-01")',
      );
      //MOVIMENTACAO DE ESTOQUE
      await this.selectAndInputMov(
        'movimentacao',
        'select id AS id, numDocto, codEmpresa, codFornecNota AS codFornecedor, codItem, codNatureza1 AS codNatureza, dataLcto AS dataLancamento, (CASE WHEN operacao1="+" THEN 1 ELSE 0 END) AS operacao, qtdMovto AS qtdItem, vlrUnitario, codUnidEstoque AS uniMedidaItem, serieFiscal from est.movimento where codNatureza1=8 AND codItem IN (SELECT codItem FROM Cgi.MascSaida WHERE {fn LEFT(mascara,2)}="12")',
      );
      console.log('Data processed successfully.');
    } catch (error) {
      console.error('Error processing data:', error);
    }
  }
}
