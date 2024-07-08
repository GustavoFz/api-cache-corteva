import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { Cron } from '@nestjs/schedule';
import { DbService } from '../db/db.service';

@Injectable()
export class ExtractAndInsertService {
  constructor(private db: DbService) {}
  private empresas = [1, 2];
  private produtosAgrichen = [
    11859, 13196, 15139, 13858, 13995, 13996, 14157, 15141, 15496, 13262, 15142,
    15111, 15143, 15108, 15140, 14684, 15144, 14156, 13699, 13698, 13444, 13447,
    13448, 15225, 15497, 13993, 13994, 14755, 11858, 13197, 14756, 15224,
  ];

  async selectAndInput(tableInput: any, select: any) {
    try {
      const rows = await this.db.cache(select);

      console.log(`Consulta realizada com sucesso na tabela ${tableInput}`);

      if (rows.length != 0) {
        const columns = Object.keys(rows[0]);
        const values = rows.map((row: any) =>
          columns.map((column) => row[column]),
        );

        await this.db.mysql(
          `REPLACE INTO ${tableInput} (${columns.join(',')}) VALUES ?`,
          [values],
        );
        console.log(`Inserção realizada com sucesso na tabela ${tableInput}`);
      } else {
        console.log(
          `Inserção não realizada na tabela ${tableInput}, pois consulta vazia`,
        );
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
  async selectAndInputItem(tableInput: any, select: any) {
    try {
      const rows = await this.db.cache(select);
      console.log(`Consulta realizada com sucesso na tabela ${tableInput}`);

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
          objeto.tipoNota = 'NAOIDENTIFICADO';
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
  async getListItensMysql() {
    const itens: any = await this.db.mysqlSelect('SELECT id FROM item');
    const listItens = itens.map((objeto: any) => String(objeto.id));
    return listItens;
  }
  async getListNfMysql() {
    const itens: any = await this.db.mysqlSelect(
      'SELECT codEmitente, numeroNota, serieNota FROM itemNotaFiscal GROUP BY codEmitente, numeroNota, serieNota',
    );
    const listEmitente = itens.map((objeto: any) => String(objeto.codEmitente));
    const listNota = itens.map((objeto: any) => String(objeto.numeroNota));
    const listSerie = itens.map((objeto: any) => String(objeto.serieNota));

    return [listEmitente, listNota, listSerie];
  }
  async getListCustomerMysql() {
    const itens: any = await this.db.mysqlSelect(
      'SELECT idDestinatario FROM notaFiscal',
    );
    const listCostumers = itens.map((objeto: any) =>
      String(`"${objeto.idDestinatario}"`),
    );

    return listCostumers;
  }
  async getListSupplierMysql() {
    const itens: any = await this.db.mysqlSelect(
      'SELECT idEmitente FROM notaFiscal',
    );
    const listSupplier = itens.map((objeto: any) =>
      String(`"${objeto.idEmitente}"`),
    );

    return listSupplier;
  }
  async extractItem() {
    await this.selectAndInputItem(
      'item',
      `SELECT i.codigo AS id, i.nome AS nome, i.unidadeMedida AS unidMedida, itemS.pesoBruto AS peso, itemS.qtdeEmbalagemPadrao AS qtdEmbalagem, itemS.mascara AS mascara, ncm.classificacaoFiscal AS ncm, CASE WHEN i.nome LIKE "SEM%" THEN "S" ELSE "D" END AS tipo, i.dataInclusao AS dataCriacao, i.dataAlter AS dataAlteracao FROM Cgi.Item AS i JOIN Cgi.ItemSaida AS itemS ON itemS.codEmpresa=1 AND itemS.codItem=i.codigo JOIN Cgi.ClassificacaoFiscal AS ncm ON i.classificacaoFiscal=ncm.id where i.id in (${this.produtosAgrichen})`,
    );
  }
  async extractItemNota() {
    const listItens = await this.getListItensMysql();
    await this.selectAndInput(
      'itemNotaFiscal',
      `SELECT item.id, item.codEmpresa AS idEmpresa, item.codEmpresa AS idEmitente, item.codEmpresa AS codEmitente, TO_NUMBER(item.numero) AS numeroNota, 1 AS serieNota, item.codProduto AS codigo, item.vlrItem AS vlrCustoEntradaUnitario, item.precoUnitarioFloat AS vlrUnitario, item.vlrItem AS vlrTotal, item.qtdeFaturada AS qtd, item.codNatOperacao AS cfop, item.vlrDesconto, item.vlrCOFINSProp AS vlrCofins, item.vlrICMS AS vlrIcms, item.vlrPISProp AS vlrPis, item.vlrTriNFC AS vlrTributoNfc, 0 AS vlrIpi, "S" AS tipoNota, item.dataEmissao, item.dataEmissao AS dataEntrada FROM fat.NotaFiscalItem AS item WHERE item.codEmpresa IN (${this.empresas}) AND item.codProduto IN (${listItens}) AND item.dataEmissao BETWEEN DATE('2023-01-01') AND DATE('2023-12-31') `,
    );
    // await this.selectAndInput(
    //   'itemNotaFiscal',
    //   `SELECT item.id, item.codEmpresa AS idEmpresa, STRING(item.codEmpresa, "||", item.codFornecedor) AS idEmitente, item.codFornecedor AS codEmitente, TO_NUMBER(item.numDocumento) AS numeroNota, item.codSerie AS serieNota, TO_NUMBER(item.codMaterial) AS codigo, item.custoEntrada AS vlrCustoEntradaUnitario, CAST((item.valorTotalItem/item.quantidade) AS NUMERIC(18,4)) AS vlrUnitario, item.valorTotalItem AS vlrTotal, item.quantidade AS qtd, item.naturezaOperacao AS cfop, 0 AS vlrDesconto, item.ValorCOFINS AS vlrCofins, item.valorICMS AS vlrIcms, item.valorPisPasepRec AS vlrPis, 0 AS vlrTributoNfc, item.valorIPI AS vlrIpi, "E" AS tipoNota, null AS dataEmissao, item.dataEntrada FROM est.NotaFiscalEntradaItens AS item WHERE item.codEmpresa IN (${this.empresas}) AND item.codMaterial IN (${listItens}) AND item.dataEntrada BETWEEN DATE('2023-01-01') AND DATE('2023-12-31') `,
    // );
  }
  async extractNota() {
    const [listEmitente, listNota, listSerie] = await this.getListNfMysql();

    await this.selectAndInput(
      'notaFiscal',
      `
      SELECT nota.id, 
        nota.codEmpresa, 
        nota.codEmpresa AS idEmitente, 
        nota.codEmpresa AS codEmitente, 
        STRING(nota.codEmpresa, "||", nota.codCliente) AS idDestinatario, 
        nota.codCliente AS codDestinatario, 
        TO_NUMBER(nota.codPedido) AS codPedido, 
        nota.numero AS numero, 
        nota.codSerie AS serie, 
        chave.chaveAcesso AS chave, 
        nota.codTipoDeNota AS idNatOperacao, 
        nota.codTipoDeNota->tipoFinalNfe+1 AS codNatOperacao, 
        nota.codTipoDeNota->descricao AS descNatOperacao, 
        %EXTERNAL(nota.codTipoDeNota->tipoFinalNfe) AS nomeNatOperacao, 
        CASE WHEN nota.situacao=2 THEN 1 ELSE 0 END AS situacao, 
        nota.dataEmissao, 
        nota.dataEmissao AS dataEntrada 
      FROM 
        fat.notafiscal AS nota 
      JOIN 
        Fat.NotaFiscalComp2 AS chave 
        ON chave.ID=nota.ID 
      WHERE 
        nota.codEmpresa IN (${this.empresas}) 
      AND 
        nota.codEmpresa IN (${listEmitente}) 
      AND 
        nota.numero IN (${listNota}) 
      AND 
        nota.codSerie IN (${listSerie})
      AND 
        nota.dataEmissao BETWEEN DATE('2023-01-01') AND DATE('2023-12-31')
      `,
    );
    // await this.selectAndInput(
    //   'notaFiscal',
    //   `
    //   SELECT nota.id,
    //     nota.codEmpresa,
    //     STRING(nota.codEmpresa, "||", nota.fornecedor) AS idEmitente,
    //     nota.fornecedor AS codEmitente,
    //     nota.codEmpresa AS idDestinatario,
    //     nota.codEmpresa AS codDestinatario,
    //     NULL AS codPedido,
    //     TO_NUMBER(nota.numDocumento) AS numero,
    //     nota.codSerie AS serie,
    //     STRING(chave.chavenfe) AS chave,
    //     NULL AS idNatOperacao,
    //     CASE WHEN nota.especieDocumento=2 THEN 1 WHEN nota.especieDocumento=3 THEN 4 WHEN nota.especieDocumento=7 THEN 2 ELSE nota.especieDocumento END AS codNatOperacao,
    //     nota.naturezaOperacao->nome AS descNatOperacao,
    //     %EXTERNAL(nota.especieDocumento) AS nomeNatOperacao,
    //     1 AS situacao,
    //     nota.dataEmissao,
    //     nota.dataEntrada
    //   FROM
    //     est.notafiscalentrada AS nota
    //   JOIN
    //     est.NotaFiscalEntradaChavElet AS chave
    //     ON
    //     nota.codEmpresa=chave.codEmpresa
    //     AND
    //     nota.numDocumento=chave.numDocumento
    //     AND
    //     nota.codSerie=chave.codSerie
    //     AND
    //     nota.fornecedor=chave.fornecedor
    //   WHERE
    //     nota.codEmpresa IN (${this.empresas})
    //   AND
    //     nota.fornecedor IN (${listEmitente})
    //   AND
    //     TO_NUMBER(nota.numDocumento) IN (${listNota})
    //   AND
    //     nota.codSerie IN (${listSerie})
    //   AND
    //     nota.dataEmissao BETWEEN DATE('2023-01-01') AND DATE('2023-12-31')
    //   `,
    // );
  }
  async extractNotaDevolucao() {
    const [listEmitente, listNota, listSerie] = await this.getListNfMysql();

    await this.selectAndInput(
      'notaFiscalDevolucao',
      `
      SELECT 
        nfd.id,
        nfd.codEmpresa AS idEmpresa, 
        nf.cliente AS idEmitenteDevolucao,
        nfe.numDocumento AS notaDevolucao, 
        nfe.codSerie AS serieDevolucao, 
        nfd.codEmpresa AS idDestinatarioDevolucao,
        nfd.numeroNota AS notaReferenciada, 
        1 AS serieReferenciada,
        nfd.dataDevolucao, 
        nfd.dataEmissao AS dataNotaReferenciada
      FROM 
        fat.nfDevolvida AS nfd 
      JOIN 
        fat.notafiscal AS nf 
        ON nfd.codEmpresa=nf.codEmpresa 
        AND nf.dataEmissao=nfd.dataEmissao 
        AND nfd.numeroNota=nf.numero
      JOIN 
        Est.NotaFiscalEntrada AS nfe 
        ON nfe.origem=2 
        AND nfe.codEmpresa=nf.codEmpresa 
        AND nfe.fornecedor=nf.codCliente 
      WHERE 
        nfd.numeroNota IN (${listNota})
      AND 
        nfe.codSerie IN (${listSerie})
      AND 
        nfe.dataEmissao=nfd.dataDevolucao
      AND
        nfd.dataEmissao BETWEEN DATE('2023-01-01') AND DATE('2023-12-31') 
      `,
    );
    await this.selectAndInput(
      'notaFiscalDevolucao',
      `
      SELECT 
        id,
        codEmpresa AS idEmpresa, 
        codEmpresa AS idEmitenteDevolucao,
        numero AS notaDevolucao, 
        1 AS serieDevolucao, 
        STRING(codEmpresa, "||", fornecedor) AS idDestinatarioDevolucao,
        numDocumento AS notaReferenciada, 
        codSerie AS serieReferenciada,
        dataEmissao AS dataDevolucao, 
        dataEntradaReferenciada AS dataNotaReferenciada
      FROM 
        fat.notafiscalReferenciadaEntrada
      WHERE 
        numDocumento IN (${listNota})
      AND 
        codSerie IN (${listSerie})
      AND  
        dataEmissao BETWEEN DATE('2023-01-01') AND DATE('2023-12-31') 
        `,
    );
  }
  async extractCustomer() {
    const listCostumers = await this.getListCustomerMysql();

    await this.selectAndInput(
      'cliente_empresa',
      `
      SELECT 
        cliente.id AS id, 
        cliente.codCliente AS codigo, 
        cliente.codEmpresa, 
        (CASE WHEN LENGTH(cliente.cnpjCpf)=11 THEN "LGPD" ELSE cliente.cnpjCpf END) AS cnpjCpf, 
        (CASE WHEN LENGTH(cliente.cnpjCpf)=11 THEN "LGPD" ELSE COALESCE(cliente.inscEstadual, "ISENTO") END) AS inscEstadual, 
        (CASE WHEN LENGTH(cliente.cnpjCpf)=11 THEN "LGPD" ELSE cliente.nome END) AS razaoSocial, 
        (CASE WHEN LENGTH(cliente.cnpjCpf)=11 THEN "LGPD" ELSE COALESCE(cliente.fantasia, "") END) AS nomeFantasia, 
        (CASE WHEN LENGTH(cliente.cnpjCpf)=11 THEN "LGPD" ELSE cliente.cep END) AS cep, 
        (CASE WHEN LENGTH(cliente.cnpjCpf)=11 THEN "LGPD" ELSE cliente.endereco END) AS endereco, 
        (CASE WHEN LENGTH(cliente.cnpjCpf)=11 THEN "LGPD" ELSE %EXTERNAL(cliente.enderecoNumero) END) AS numeroEndereco, 
        (CASE WHEN LENGTH(cliente.cnpjCpf)=11 THEN "LGPD" ELSE cliente.bairro END) AS bairro, 
        cliente.nomeCidade AS cidade, 
        cliente.nomeEstado AS estado, 
        ibge.codIBGE AS codigoIbge, 
        (CASE WHEN LENGTH(cliente.cnpjCpf)=11 THEN "LGPD" ELSE COALESCE(compl.telefone, compl.fax, "NAOINFO") END) AS telefone, 
        (CASE WHEN LENGTH(cliente.cnpjCpf)=11 THEN "LGPD" ELSE COALESCE(compl.telexCelular, "NAOINFO") END) AS celular, 
        (CASE WHEN LENGTH(cliente.cnpjCpf)=11 THEN "LGPD" ELSE COALESCE(cliente.email, "NAOINFO") END) AS email, 
        %ODBCOUT(COALESCE(cliente.dataAlterSituacao, compl2.dataAlter, DATE("2000-01-01"))) AS dataRegistro, 
        (CASE wHEN cliente.situacao=1 THEN 1 ELSE 0 END) AS situacao, 
        "C" AS tipoCadastro 
      FROM 
        fat.cliente AS cliente 
      JOIN 
        cad.cidade AS ibge 
        ON ibge.ID=SUBSTRING(cliente.cep,1,5) 
      JOIN 
        Fat.CliComplemento2 AS compl 
        ON cliente.ID=compl.ID 
      JOIN 
        Fat.CliComplemento3 AS compl2 
        ON cliente.id=compl2.ID 
      WHERE 
        cliente.id IN (${listCostumers})`,
    );
    await this.selectAndInput(
      'cliente_empresa',
      `SELECT empresa.id AS id, empresa.id AS codigo, 1 AS codEmpresa, empresa.cnpjCpf AS cnpjCpf, inscEstadual AS inscEstadual, empresa.nome AS razaoSocial, COALESCE(empresa.fantasia, "") AS nomeFantasia, empresa.cep AS cep, empresa.endereco, %EXTERNAL(empresa.numEmpLogradouro) AS numeroEndereco, empresa.bairro, empresa.nomeCidade AS cidade, empresa.estado, ibge.codIBGE AS codigoIbge, COALESCE(empresa.telefone, "NAOINFO") AS telefone, "69 99233-6880" AS celular, "sac@rical.com.br" AS email, COALESCE(empresa.dataRegistro, DATE("2000-01-01")) AS dataRegistro, empresa.situacao AS situacao, "E" AS tipoCadastro FROM cad.empresa AS empresa JOIN cad.cidade AS ibge ON ibge.ID=SUBSTRING(empresa.cep,1,5) WHERE empresa.id IN (${listCostumers})`,
    );
  }
  async extractCompany() {
    await this.selectAndInput(
      'empresa',
      `SELECT empresa.id AS id,
        empresa.cnpjCpf AS cnpjCpf,
        inscEstadual AS inscEstadual,
        empresa.nome AS razaoSocial,
        COALESCE(empresa.fantasia, "") AS nomeFantasia,
        empresa.cep AS cep,
        empresa.endereco, %EXTERNAL(empresa.numEmpLogradouro) AS numeroEndereco,
        empresa.bairro, empresa.nomeCidade AS cidade,
        empresa.estado, ibge.codIBGE AS codigoIbge,
        empresa.telefone, "sac@rical.com.br" AS email,
        COALESCE(empresa.dataRegistro, DATE("2000-01-01")) AS dataRegistro,
        empresa.situacao AS situacao 
      FROM 
        cad.empresa AS empresa 
      JOIN 
        cad.cidade AS ibge 
        ON ibge.ID=SUBSTRING(empresa.cep,1,5)`,
    );
  }
  async extractSupplier() {
    const listSupplier = await this.getListSupplierMysql();
    await this.selectAndInput(
      'fornecedor',
      `
      SELECT fornecedor.id AS id, 
        fornecedor.codigo AS codigo, 
        fornecedor.codEmpresa AS codEmpresa, 
        fornecedor.cnpjCpf AS cnpjCpf, 
        fornecedor.inscEstadual inscEstadual, 
        fornecedor.nome AS razaoSocial, 
        COALESCE(fornecedor.fantasia, "") AS nomeFantasia, 
        fornecedor.cep AS cep, 
        fornecedor.endereco AS endereco, 
        fornecedor.nroEndereco AS numeroEndereco, 
        fornecedor.bairro AS bairro, 
        fornecedor.nomeCidade AS cidade, 
        fornecedor.siglaEstado AS estado, 
        ibge.codIBGE AS codigoIbge, 
        COALESCE(fornecedor.telefone, fornecedor.telefone1) AS telefone, 
        fornecedor.email AS email, 
        COALESCE(fornecedor.dataSituacao, DATE("2000-01-01")) AS dataRegistro 
      FROM 
        cpg.fornecedor AS fornecedor 
      JOIN 
        cad.cidade AS ibge 
        ON ibge.ID=SUBSTRING(fornecedor.cep,1,5) 
      WHERE 
        fornecedor.id IN (${listSupplier})`,
    );
  }
  async extractTransaction() {
    const listItens = await this.getListItensMysql();
    await this.selectAndInputMov(
      'movimentacao',
      `
      SELECT 
        id AS id, 
        numDocto, 
        codEmpresa, 
        (CASE WHEN codFornecNota!="" THEN STRING(codEmpresa, "||", codFornecNota) ELSE codEmpresa END) AS idFornecedor, 
        COALESCE(codFornecNota, codEmpresa) AS codFornecedor, 
        codItem, codNatureza1 AS codNatureza, 
        dataLcto AS dataLancamento, 
        (CASE WHEN operacao1="+" THEN 1 ELSE 0 END) AS operacao, 
        qtdMovto AS qtdItem, 
        vlrUnitario AS vlrUnitario, 
        serieFiscal AS serieFiscal 
      FROM 
        est.movimento 
      WHERE 
        codNatureza1=8 
      AND 
        codItem IN (${listItens})`,
    );
  }
  async extractNaturezaOperacao() {
    await this.selectAndInput(
      'naturezaOperacao',
      'SELECT id, UPPER(nome) AS nome FROM cad.natOperacao',
    );
  }

  onModuleInit() {
    this.processData();
  }

  // Cron de Segunda a Sabado entre as 7h e 19h a cada 2 horas
  @Cron('0 7-19/4 * * 1-6', {
    name: 'Atualização',
    timeZone: 'America/Porto_Velho',
  })
  async processData(): Promise<void> {
    try {
      // 1 - ITEM - EXTRAI PRODUTOS DE REVENDA DO CONSISTEM COM BASE NA LISTA DE NCM DA CORTEVA
      await this.extractItem();

      // 2 - ITEM DA NOTA FICAL - EXTRAI ITENS DA NOTA DE ENTRADA E SAIDA DO CONSISTEM COM BASE NOS ITENS EXISTENTES NA TABELA 'item' DO DB
      await this.extractItemNota();

      // 3 - NOTAS FISCAIS - EXTRAI NOTAS DE ENTRADA E SAIDA DO CONSISTEM COM BASE NOS NUMEROS DE NOTAS EXISTENTES NATABELA 'itemNotaFiscal' DO DB
      await this.extractNota();
      await this.extractNotaDevolucao();

      // 4 - CLIENTE/EMPRESA - EXTRAI CLIENTES E EMPRESAS RICAL DO CONSISTEM COM BASE NOS CLIENTES EXISTENTES NA TABELA 'NotaFiscal' DO DB
      await this.extractCustomer();

      // 5 - EMPRESA - EXTRAI EMPRESAS RICAL DA TABELA
      await this.extractCompany();

      // 6 - FORNECEDOR - EXTRAI FORNECEDORS
      await this.extractSupplier();

      // 7 - NATUREZA DE OPERACAO - EXTRAI CODIGO E DESCRICAO CFOP
      await this.extractNaturezaOperacao();

      // 8 - MOVIMENTO FISCAL
      await this.extractTransaction();

      console.log('Dados processados com sucesso.');
    } catch (error) {
      console.error('Erro ao processar dados:', error);
    }
  }
}
