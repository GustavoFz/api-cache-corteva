import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly httpService: HttpService,
    private env: ConfigService,
  ) {}

  url = this.env.get<string>('API_DB_URL');

  async findOne(id: number, dateStart: string, dateEnd: string) {
    const company = [1, 2];

    // const data = {
    //   query: `SELECT ne.ID AS codi_ven, ne.codPedido AS codi_ped, STRING(ne.codEmpresa) AS codi_rev, "obrigatório - nao temos" AS codi_fab, "55" AS modl_ven, ne.codEmpresa->CNPJCPF AS emit_ven, STRING(ne.codNumNota) AS nume_ven, ne.codSerie AS seri_ven, chave.chaveAcesso AS chav_ven, STRING(ne.codTipoDeNota->tipoFinalNfe+1) AS fina_ven, %ODBCOUT(ne.dataEmissao) AS data_ven, DATEADD('day',45,ne.dataEmissao) AS datv_ven, null AS obsv_ven, "obrigatorio" AS orig_ven, "ne.codCondVenda - obrigatório - não controlamos" AS codi_con, "(ne.CondicaoDeVenda->descricao) - obrigatório - não controlamos" AS desc_con, "obrigatório - não controlamos" AS tipo_con, "obrigatório - não controlamos" AS praz_con, null AS inde_ven, null AS dind_ven, null AS bund_ven, null AS cota_ven, STRING(ne.codTipoDeNota) oper_ven, ne.codNatOperacao AS cfop_ven, (CASE WHEN ne.situacao=2 THEN "A" WHEN ne.situacao=3 THEN "C" END) AS stat_ven, cliente.CNPJCPF AS dest_ven, ne.codTipoDeNota->descricao AS desc_opr, (CASE WHEN (ne.codTipoDeNota->tipoFinalNfe+1)=4 THEN "S" ELSE "E" END) AS sina_opr, ne.codCliente AS codi_cli, item.codProduto AS codi_pro, (item.codProduto->nome) AS desc_pro, (item.codClassifFiscal->classificacaoFiscal) AS ncmp_pro, (item.codProduto->unidadeMedida) AS unid_pro, null AS barr_pro, null AS cind_pro, null AS lote_ivn, (CASE WHEN item.codClassifFiscal->classificacaoFiscal LIKE '12%' THEN 'S' ELSE 'D' END) AS fsem_pro, null AS trat_pro, CAST((item.vlrCOFINSProp+item.vlrICMS+item.vlrPISProp+item.vlrTriNFC) AS NUMERIC(18,4)) AS trib_ivn, null AS cond_cul, null AS desc_cul, null AS crec_inv, null AS drec_ivn, CAST((item.precoUnitario/1000) AS NUMERIC(18,4)) AS pbru_ivn, CAST((item.precoUnitario/1000)-(item.vlrDesconto/qtdeFaturada) AS NUMERIC(18,4)) AS pliq_ivn, item.qtdeFaturada AS qtde_ivn, ne.codRepresentante AS codi_ved, representante.nome AS nome_ved, representante.CNPJCPF AS cpfc_ved, null AS enco_ivn, null AS nume_ivn, null AS bair_ivn, null AS comp_ivn, null AS cepc_ivn, STRING(ibge.codIBGE) AS muni_ivn, cliente.CNPJCPF AS cnpj_cli, cliente.inscEstadual AS insc_cli, cliente.nome AS nome_cli, cliente.endereco AS enco_cli, cliente.enderecoNumero AS nume_cli, cliente.bairro AS bair_cli, null AS comp_cli, cliente.CEP AS cepc_cli, STRING(ibge.codIBGE) AS muni_cli, COALESCE(cliente_complemento2.telefone, cliente_complemento2.telexCelular, cliente_complemento2.fax) AS tele_cli, null AS tel2_cli, null AS celu_cli, cliente.email AS email_cli, %ODBCOUT(COALESCE(cliente.dataAlterSituacao, cliente_complemento3.dataAlter)) AS duma_cli, null AS dnac_cli FROM Fat.NotaFiscal AS ne INNER JOIN Fat.NotaFiscalItem AS item ON ne.codNumNota=item.numero INNER JOIN Fat.NFPorChaveAcesso AS chave ON chave.codEmpresa=ne.codEmpresa AND chave.numeroNota=ne.codNumNota INNER JOIN Fat.Cliente AS cliente ON ne.Cliente=cliente.ID INNER JOIN Fat.Representante AS representante ON ne.Representante=representante.ID INNER JOIN Cad.Cidade AS ibge ON ibge.ID=SUBSTRING(cliente.cep,1,5) INNER JOIN Fat.CliComplemento2 AS cliente_complemento2 ON ne.Cliente=cliente_complemento2.ID INNER JOIN Fat.CliComplemento3 AS cliente_complemento3 ON ne.Cliente=cliente_complemento3.ID WHERE ne.codEmpresa=${id} AND item.codProduto in (SELECT codItem FROM Cgi.MascSaida WHERE {fn LEFT(mascara,2)}="12") AND ne.dataEmissao>=DATE("${dateStart}") AND ne.dataEmissao<=DATE("${dateEnd}")`,
    // };

    // const data = {
    //   query: `SELECT ne.ID AS codi_ven, ne.codPedido AS codi_ped, STRING(ne.codEmpresa) AS codi_rev, "obrigatório - nao temos" AS codi_fab, "55" AS modl_ven, ne.codEmpresa->CNPJCPF AS emit_ven, STRING(ne.codNumNota) AS nume_ven, ne.codSerie AS seri_ven, chave.chaveAcesso AS chav_ven, STRING(ne.codTipoDeNota->tipoFinalNfe+1) AS fina_ven, %ODBCOUT(ne.dataEmissao) AS data_ven, DATEADD('day',45,ne.dataEmissao) AS datv_ven, null AS obsv_ven, "obrigatorio" AS orig_ven, "ne.codCondVenda - obrigatório - não controlamos" AS codi_con, "(ne.CondicaoDeVenda->descricao) - obrigatório - não controlamos" AS desc_con, "obrigatório - não controlamos" AS tipo_con, "obrigatório - não controlamos" AS praz_con, null AS inde_ven, null AS dind_ven, null AS bund_ven, null AS cota_ven, STRING(ne.codTipoDeNota) oper_ven, ne.codNatOperacao AS cfop_ven, (CASE WHEN ne.situacao=2 THEN "A" WHEN ne.situacao=3 THEN "C" END) AS stat_ven, cliente.CNPJCPF AS dest_ven, ne.codTipoDeNota->descricao AS desc_opr, (CASE WHEN (ne.codTipoDeNota->tipoFinalNfe+1)=4 THEN "S" ELSE "E" END) AS sina_opr, ne.codCliente AS codi_cli, item.codProduto AS codi_pro, (item.codProduto->nome) AS desc_pro, (item.codClassifFiscal->classificacaoFiscal) AS ncmp_pro, (item.codProduto->unidadeMedida) AS unid_pro, null AS barr_pro, null AS cind_pro, null AS lote_ivn, (CASE WHEN item.codClassifFiscal->classificacaoFiscal LIKE '12%' THEN 'S' ELSE 'D' END) AS fsem_pro, null AS trat_pro, CAST((item.vlrCOFINSProp+item.vlrICMS+item.vlrPISProp+item.vlrTriNFC) AS NUMERIC(18,4)) AS trib_ivn, null AS cond_cul, null AS desc_cul, null AS crec_inv, null AS drec_ivn, CAST((item.precoUnitario/1000) AS NUMERIC(18,4)) AS pbru_ivn, CAST((item.precoUnitario/1000)-(item.vlrDesconto/qtdeFaturada) AS NUMERIC(18,4)) AS pliq_ivn, item.qtdeFaturada AS qtde_ivn, ne.codRepresentante AS codi_ved, representante.nome AS nome_ved, representante.CNPJCPF AS cpfc_ved, null AS enco_ivn, null AS nume_ivn, null AS bair_ivn, null AS comp_ivn, null AS cepc_ivn, STRING(ibge.codIBGE) AS muni_ivn, cliente.CNPJCPF AS cnpj_cli, cliente.inscEstadual AS insc_cli, cliente.nome AS nome_cli, cliente.endereco AS enco_cli, cliente.enderecoNumero AS nume_cli, cliente.bairro AS bair_cli, null AS comp_cli, cliente.CEP AS cepc_cli, STRING(ibge.codIBGE) AS muni_cli, COALESCE(cliente_complemento2.telefone, cliente_complemento2.telexCelular, cliente_complemento2.fax) AS tele_cli, null AS tel2_cli, null AS celu_cli, cliente.email AS email_cli, %ODBCOUT(COALESCE(cliente.dataAlterSituacao, cliente_complemento3.dataAlter)) AS duma_cli, null AS dnac_cli FROM Fat.NotaFiscal AS ne JOIN Fat.NotaFiscalItem AS item ON ne.codNumNota=item.numero JOIN Fat.NFPorChaveAcesso AS chave ON chave.codEmpresa=ne.codEmpresa AND chave.numeroNota=ne.codNumNota JOIN Fat.Cliente AS cliente ON ne.Cliente=cliente.ID JOIN Fat.Representante AS representante ON ne.Representante=representante.ID JOIN Cad.Cidade AS ibge ON ibge.ID=SUBSTRING(cliente.cep,1,5) JOIN Fat.CliComplemento2 AS cliente_complemento2 ON ne.Cliente=cliente_complemento2.ID JOIN Fat.CliComplemento3 AS cliente_complemento3 ON ne.Cliente=cliente_complemento3.ID WHERE ne.codEmpresa=${id} AND item.codProduto in (SELECT codItem FROM Cgi.MascSaida WHERE {fn LEFT(mascara,2)}="12") AND ne.dataEmissao>=DATE("${dateStart}") AND ne.dataEmissao<=DATE("${dateEnd}")`,
    // };
    
    const data = {
      query: `SELECT ne.ID AS codi_ven, "null" AS codi_ped, STRING(ne.codEmpresa) AS codi_rev, "obrigatório - nao temos" AS codi_fab, "55" AS modl_ven, fornecedor.CNPJCPF AS emit_ven, ne.numDocumento AS nume_ven, ne.codSerie AS seri_ven, STRING(chave.chaveNfe) AS chav_ven, (CASE WHEN ne.especieDocumento=3 THEN 4 ELSE ne.especieDocumento END) AS fina_ven, %ODBCOUT(ne.dataEmissao) AS data_ven, "OBRIGATORIO" AS datv_ven, "OBRIGATORIO" orig_ven, "ne.codCondVenda - obrigatório - não controlamos" AS codi_con, "(ne.CondicaoDeVenda->descricao) - obrigatório - não controlamos" AS desc_con, "obrigatório - não controlamos" AS tipo_con, "obrigatório - não controlamos" AS praz_con, null AS inde_ven, null AS dind_ven, null AS bund_ven, null AS cota_ven, item.naturezaOperacao AS oper_ven, item.naturezaOperacao AS cfop_ven, "A" AS stat_ven FROM Est.NotaFiscalEntrada AS ne JOIN Est.NotaFiscalEntradaItens AS item ON ne.codEmpresa=item.codEmpresa AND ne.numDocumento=item.numDocumento JOIN Cpg.Fornecedor AS fornecedor ON ne.fornecedor=fornecedor.codigo AND ne.codEmpresa=fornecedor.codEmpresa JOIN Est.NotaFiscalEntradaChavElet AS chave ON chave.codSerie=ne.codSerie AND chave.fornecedor=ne.fornecedor AND chave.numDocumento=ne.numDocumento AND chave.fornecedor=ne.fornecedor WHERE %ODBCOUT(ne.especieDocumento) IN (1,3) AND item.codMaterial in (SELECT codItem FROM Cgi.MascSaida WHERE {fn LEFT(mascara,2)}="12") AND ne.dataEmissao>=DATE("2022-12-01")`,
    };

     // SELECT mov.numDocto, nf.codNumNota, nf.codSerie FROM Est.Movimento AS mov JOIN Fat.NotaFiscal AS nf ON mov.codEmpresa=nf.codEmpresa AND mov.numDocto=STRING("NF",nf.codNumNota) WHERE mov.codEmpresa=2 AND mov.codItem IN (SELECT codItem FROM Cgi.MascSaida WHERE {fn LEFT(mascara,2)}="12") AND mov.dataMovto>=DATE("2023-12-01")

      // SELECT mov.numDocto, ne.numDocumento, ne.codSerie FROM Est.Movimento AS mov JOIN Est.NotaFiscalEntrada AS ne ON mov.codEmpresa=ne.codEmpresa AND mov.numDocto=STRING("NE",ne.numDocumento,"/",ne.codSerie) WHERE mov.codEmpresa=2 AND mov.codItem IN (SELECT codItem FROM Cgi.MascSaida WHERE {fn LEFT(mascara,2)}="12") AND mov.dataMovto>=DATE("2023-12-01")


    if (!company.includes(id)) {
      throw new NotFoundException();
    }

    const response = await firstValueFrom(
      this.httpService.post(this.url, data),
    );

    const invoices = response.data.result.content;
    //TROCA CAMPOS VAZIOS POR NULL
    return invoices.map((invoice) => {
      for (const prop in invoice) {
        if (invoice[prop] === '') {
          invoice[prop] = null;
        }
      }
      return invoice;
    });
  }
}
