import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class InvoicesService {
  constructor(private readonly db: DbService) {}

  async findOne(id: number, dateStart: string, dateEnd: string) {
    const company = [1, 2];

    if (!company.includes(id)) {
      throw new NotFoundException();
    }

    const data = await this.db.mysqlSelect(`SELECT
    (SELECT
        COUNT(ID)
    FROM
        movimentacao
    WHERE
        movimentacao.codEmpresa = nota.codEmpresa AND movimentacao.numeroNota = nota.numero AND movimentacao.serieFiscal = nota.codSerie) AS teste_qtd_itens_nota,
    nota.id AS codi_ven,
    item.id as itemId,
    mov.id as movId,
    nota.codPedido AS codi_ped,
    nota.codEmpresa AS codi_rev,
    "obrigatório - nao temos" AS codi_fab,
    "55" AS modl_ven,
    empresa.cnpjCpf AS emit_ven,
    nota.numero AS nume_ven,
    nota.codSerie AS seri_ven,
    nota.chave AS chav_ven,
    nota.codTipoDeNota AS fina_ven,
    DATE_FORMAT(nota.dataEmissao, "%Y-%m-%d") AS data_ven,
    DATE_FORMAT(DATE_ADD(nota.dataEmissao, INTERVAL 45 DAY), "%Y-%m-%d") AS datv_ven,
    NULL AS obsv_ven,
    "obrigatorio" AS orig_ven,
    "nota.codCondVenda - obrigatório - não controlamos" AS codi_con,
    "(nota.CondicaoDeVenda->descricao) - obrigatório - não controlamos" AS desc_con,
    "obrigatório - não controlamos" AS tipo_con,
    "obrigatório - não controlamos" AS praz_con,
    NULL AS inde_ven,
    NULL AS dind_ven,
    NULL AS bund_ven,
    NULL AS cota_ven,
    nota.descTipoDeNota oper_ven,
    nota.codNatOperacao AS cfop_ven,
    "situacao nota" AS stat_ven,
    cliente.cnpjCpf AS dest_ven,
    nota.DescTipoDeNota AS desc_opr,
    mov.operacao AS sina_opr,
    nota.codCliente AS codi_cli,
    item.codItem AS codi_pro,
    item.nomeItem AS desc_pro,
    item.ncm AS ncmp_pro,
    item.unidMedida AS unid_pro,
    NULL AS barr_pro,
    NULL AS cind_pro,
    NULL AS lote_ivn,
    "S para semente e D para defensivo" AS fsem_pro,
    NULL AS trat_pro,
    item.vlrCofins + item.vlrIcms + item.vlrPis + item.vlrTributoNfc AS trib_ivn,
    NULL AS cond_cul,
    NULL AS desc_cul,
    NULL AS crec_inv,
    NULL AS drec_ivn,
    item.vlrItem AS pbru_ivn,
    CONVERT(item.vlrItem - (item.vlrDesconto + item.vlrCofins + item.vlrIcms + item.vlrPis + item.vlrTributoNfc) /(
    SELECT
        COUNT(ID)
    FROM
        movimentacao
    WHERE
        movimentacao.codEmpresa = nota.codEmpresa AND movimentacao.numeroNota = nota.numero AND movimentacao.serieFiscal = nota.codSerie
), DECIMAL(18,4)) AS pliq_ivn,
item.qtdItem AS qtde_ivn,
nota.codRepresentante AS codi_ved,
nota.nomeRepresentante AS nome_ved,
nota.cnpjcpfRepresentante AS cpfc_ved,
NULL AS enco_ivn,
NULL AS nume_ivn,
NULL AS bair_ivn,
NULL AS comp_ivn,
NULL AS cepc_ivn,
empresa.codigoIbge AS muni_ivn,
cliente.cnpjCpf AS cnpj_cli,
cliente.inscEstadual AS insc_cli,
cliente.razaoSocial AS nome_cli,
cliente.endereco AS enco_cli,
cliente.numeroEndereco AS nume_cli,
cliente.bairro AS bair_cli,
NULL AS comp_cli,
cliente.cep AS cepc_cli,
cliente.codigoIbge AS muni_cli,
cliente.telefone AS tele_cli,
NULL AS tel2_cli,
NULL AS celu_cli,
"email" AS email_cli,
cliente.situacao AS duma_cli,
NULL AS dnac_cli
FROM
    movimentacao AS mov
JOIN notaSaida AS nota
ON
    mov.numeroNota = nota.numero AND mov.codEmpresa = nota.codEmpresa AND mov.serieFiscal = nota.codSerie
JOIN itemNotaSaida AS item
ON
    item.codItem=mov.codItem AND item.numeroNota = mov.numeroNota AND item.codEmpresa = mov.codEmpresa 
JOIN cliente ON nota.idCliente = cliente.id
JOIN empresa ON mov.codEmpresa = empresa.id
WHERE mov.codEmpresa=${id} AND dataLancamento BETWEEN '${dateStart}' AND '${dateEnd}'
UNION ALL
SELECT
(SELECT
  COUNT(ID)
FROM
  movimentacao
WHERE
  movimentacao.codEmpresa = nota.codEmpresa AND movimentacao.numeroNota = nota.numero AND movimentacao.serieFiscal = nota.codSerie) AS teste_qtd_itens_nota,
    nota.id AS codi_ven,
    item.id as itemId,
    mov.id as movId,
    NULL AS codi_ped,
    nota.codEmpresa AS codi_rev,
    "obrigatório - nao temos" AS codi_fab,
    "55" AS modl_ven,
    fornecedor.cnpjCpf AS emit_ven,
    nota.numero AS nume_ven,
    nota.codSerie AS seri_ven,
    nota.chave AS chav_ven,
    nota.codTipoDeNota AS fina_ven,
    DATE_FORMAT(nota.dataEmissao, "%Y-%m-%d") AS data_ven,
    DATE_FORMAT(DATE_ADD(nota.dataEmissao, INTERVAL 45 DAY), "%Y-%m-%d") AS datv_ven,
    NULL AS obsv_ven,
    "obrigatorio" AS orig_ven,
    "nota.codCondVenda - obrigatório - não controlamos" AS codi_con,
    "(nota.CondicaoDeVenda->descricao) - obrigatório - não controlamos" AS desc_con,
    "obrigatório - não controlamos" AS tipo_con,
    "obrigatório - não controlamos" AS praz_con,
    NULL AS inde_ven,
    NULL AS dind_ven,
    NULL AS bund_ven,
    NULL AS cota_ven,
    nota.descTipoDeNota oper_ven,
    nota.naturezaOperacao AS cfop_ven,
    "situacao nota" AS stat_ven,
    fornecedor.cnpjCpf AS dest_ven,
    nota.DescTipoDeNota AS desc_opr,
    mov.operacao AS sina_opr,
    nota.codFornecedor AS codi_cli,
    item.codItem AS codi_pro,
    item.nomeItem AS desc_pro,
    item.ncm AS ncmp_pro,
    item.unidMedida AS unid_pro,
    NULL AS barr_pro,
    NULL AS cind_pro,
    NULL AS lote_ivn,
    "S para semente e D para defensivo" AS fsem_pro,
    NULL AS trat_pro,
    item.vlrCofins + item.vlrIcms + item.vlrPis + item.vlrIpi AS trib_ivn,
    NULL AS cond_cul,
    NULL AS desc_cul,
    NULL AS crec_inv,
    NULL AS drec_ivn,
    item.vlrItem AS pbru_ivn,
    CONVERT(item.vlrItem - (item.vlrDesconto + item.vlrCofins + item.vlrIcms + item.vlrPis + item.vlrIpi) /(
    SELECT
        COUNT(ID)
    FROM
        movimentacao
    WHERE
        movimentacao.codEmpresa = nota.codEmpresa AND movimentacao.numeroNota = nota.numero AND movimentacao.serieFiscal = nota.codSerie AND movimentacao.codFornecedor=nota.codFornecedor
), DECIMAL(18,4)) AS pliq_ivn,
item.qtdItem AS qtde_ivn,
"sem controle de representante" AS codi_ved,
"sem controle de representante" AS nome_ved,
"sem controle de representante" AS cpfc_ved,
NULL AS enco_ivn,
NULL AS nume_ivn,
NULL AS bair_ivn,
NULL AS comp_ivn,
NULL AS cepc_ivn,
fornecedor.codigoIbge AS muni_ivn,
empresa.cnpjCpf AS cnpj_cli,
"adicionar inscricao estadual no cadastro de empresa" AS insc_cli,
empresa.razaoSocial AS nome_cli,
empresa.endereco AS enco_cli,
empresa.numeroEndereco AS nume_cli,
empresa.bairro AS bair_cli,
NULL AS comp_cli,
empresa.cep AS cepc_cli,
empresa.codigoIbge AS muni_cli,
empresa.telefone AS tele_cli,
NULL AS tel2_cli,
NULL AS celu_cli,
"email" AS email_cli,
empresa.situacao AS duma_cli,
NULL AS dnac_cli
FROM
    movimentacao AS mov
JOIN notaEntrada AS nota
ON
    mov.numeroNota=nota.numero AND mov.codEmpresa=nota.codEmpresa AND mov.serieFiscal=nota.codSerie AND nota.codFornecedor=mov.codFornecedor
JOIN itemNotaEntrada AS item
ON
    mov.tipoNota="NE" AND item.codItem=mov.codItem AND item.numeroNota=mov.numeroNota AND item.codEmpresa=mov.codEmpresa AND item.codFornecedor=mov.codFornecedor AND mov.serieFiscal=item.serieNota AND mov.dataLancamento=item.dataEntrada AND mov.qtdItem=item.qtdItem AND item.vlrUnitarioItem=mov.vlrUnitario
JOIN fornecedor ON nota.idFornecedor = fornecedor.id
JOIN empresa ON mov.codEmpresa = empresa.id 
WHERE mov.codEmpresa=${id} AND dataLancamento BETWEEN '${dateStart}' AND '${dateEnd}'`);

    return data;

    // const sql = `SELECT
    // nota.ID AS codi_ven,
    // nota.codPedido AS codi_ped,
    // STRING(nota.codEmpresa) AS codi_rev,
    // "obrigatório - nao temos" AS codi_fab,
    // "55" AS modl_ven,
    // nota.codEmpresa->CNPJCPF AS emit_ven,
    // STRING(nota.codNumNota) AS nume_ven,
    // nota.codSerie AS seri_ven,
    // chave.chaveAcesso AS chav_ven,
    // STRING(nota.codTipoDeNota->tipoFinalNfe+1) AS fina_ven,
    // %ODBCOUT(nota.dataEmissao) AS data_ven,
    // DATEADD('day',45,nota.dataEmissao) AS datv_ven,
    // null AS obsv_ven, "obrigatorio" AS orig_ven,
    // "nota.codCondVenda - obrigatório - não controlamos" AS codi_con,
    // "(nota.CondicaoDeVenda->descricao) - obrigatório - não controlamos" AS desc_con,
    // "obrigatório - não controlamos" AS tipo_con,
    // "obrigatório - não controlamos" AS praz_con,
    // null AS inde_ven,
    // null AS dind_ven,
    // null AS bund_ven,
    // null AS cota_ven,
    // STRING(nota.codTipoDeNota) oper_ven,
    // nota.codNatOperacao AS cfop_ven,
    // (CASE WHEN nota.situacao=2 THEN "A" WHEN nota.situacao=3 THEN "C" END) AS stat_ven,
    // cliente.CNPJCPF AS dest_ven,
    // nota.codTipoDeNota->descricao AS desc_opr,
    // (CASE WHEN mov.operacao1="+" THEN "E" ELSE "S" END) AS sina_opr,
    // nota.codCliente AS codi_cli,
    // item.codProduto AS codi_pro,
    // (item.codProduto->nome) AS desc_pro,
    // (item.codClassifFiscal->classificacaoFiscal) AS ncmp_pro,
    // (item.codProduto->unidadeMedida) AS unid_pro,
    // null AS barr_pro,
    // null AS cind_pro,
    // null AS lote_ivn,
    // (CASE WHEN item.codClassifFiscal->classificacaoFiscal LIKE '12%' THEN 'S' ELSE 'D' END) AS fsem_pro,
    // null AS trat_pro,
    // CAST((item.vlrCOFINSProp+item.vlrICMS+item.vlrPISProp+item.vlrTriNFC) AS NUMERIC(18,4)) AS trib_ivn,
    // null AS cond_cul,
    // null AS desc_cul,
    // null AS crec_inv,
    // null AS drec_ivn,
    // CAST((item.vlrItem) AS NUMERIC(18,4)) AS pbru_ivn,
    // CAST(item.vlrItem-(item.vlrDesconto/(SELECT COUNT(ID) FROM Fat.NotaFiscalItem WHERE numero=nota.codNumNota AND codEmpresa=nota.codEmpresa AND dataEmissao=nota.dataEmissao)) AS NUMERIC(18,4)) AS pliq_ivn,
    // item.qtdeFaturada AS qtde_ivn,
    // nota.codRepresentante AS codi_ved,
    // representante.nome AS nome_ved,
    // representante.CNPJCPF AS cpfc_ved,
    // null AS enco_ivn,
    // null AS nume_ivn,
    // null AS bair_ivn,
    // null AS comp_ivn,
    // null AS cepc_ivn,
    // STRING(ibge.codIBGE) AS muni_ivn,
    // cliente.CNPJCPF AS cnpj_cli,
    // cliente.inscEstadual AS insc_cli,
    // cliente.nome AS nome_cli,
    // cliente.endereco AS enco_cli,
    // cliente.enderecoNumero AS nume_cli,
    // cliente.bairro AS bair_cli,
    // null AS comp_cli,
    // cliente.CEP AS cepc_cli,
    // STRING(ibge.codIBGE) AS muni_cli,
    // COALESCE(cliente_complemento2.telefone, cliente_complemento2.telexCelular, cliente_complemento2.fax) AS tele_cli,
    // null AS tel2_cli,
    // null AS celu_cli,
    // cliente.email AS email_cli,
    // %ODBCOUT(COALESCE(cliente.dataAlterSituacao, cliente_complemento3.dataAlter)) AS duma_cli,
    // null AS dnac_cli
    // FROM Est.Movimento AS mov
    // JOIN Fat.NotaFiscal AS nota ON mov.codEmpresa=nota.codEmpresa AND mov.numDocto=STRING("NF",nota.codNumNota)
    // JOIN Fat.NotaFiscalItem AS item ON item.numero=nota.numero AND nota.dataEmissao=item.dataEmissao
    // JOIN Fat.NotaFiscalComp2 AS chave ON chave.ID=nota.ID
    // JOIN Fat.Cliente AS cliente ON nota.Cliente=cliente.ID
    // JOIN Fat.Representante AS representante ON nota.Representante=representante.ID
    // JOIN Cad.Cidade AS ibge ON ibge.ID=SUBSTRING(cliente.cep,1,5)
    // JOIN Fat.CliComplemento2 AS cliente_complemento2 ON nota.Cliente=cliente_complemento2.ID
    // JOIN Fat.CliComplemento3 AS cliente_complemento3 ON nota.Cliente=cliente_complemento3.ID
    // WHERE mov.codNatureza1=8 AND nota.codEmpresa=1 AND mov.dataLcto>=DATE("2023-12-01")`;

    // const data = await this.db.cache(sql);

    // return data;

    // const data = {
    //   query: `SELECT nota.ID AS codi_ven, null AS codi_ped, STRING(nota.codEmpresa) AS codi_rev, "obrigatório - nao temos" AS codi_fab, "55" AS modl_ven, fornecedor.CNPJCPF AS emit_ven, STRING(nota.numDocumento) AS nume_ven, STRING(nota.codSerie) AS seri_ven, STRING(chave.chaveNfe) AS chav_ven, STRING(CASE WHEN nota.especieDocumento=3 THEN 4 ELSE nota.especieDocumento END) AS fina_ven, %ODBCOUT(nota.dataEmissao) AS data_ven, "OBRIGATORIO" AS datv_ven, null AS obsv_ven, "OBRIGATORIO" orig_ven, "nota.codCondVenda - obrigatório - não controlamos" AS codi_con, "(nota.CondicaoDeVenda->descricao) - obrigatório - não controlamos" AS desc_con, "obrigatório - não controlamos" AS tipo_con, "obrigatório - não controlamos" AS praz_con, null AS inde_ven, null AS dind_ven, null AS bund_ven, null AS cota_ven, STRING(item.naturezaOperacao) AS oper_ven, STRING(item.naturezaOperacao) AS cfop_ven, "A" AS stat_ven, empresa.CNPJCPF dest_ven, (nota.naturezaOperacao->nome) AS desc_opr, (CASE WHEN nota.especieDocumento=1 THEN "E" WHEN nota.especieDocumento=3 THEN "S" END) AS sina_opr, STRING(nota.codEmpresa) AS codi_cli, item.codMaterial AS codi_pro, STRING(item.descricaoItem) AS desc_pro, STRING(item.classificacaoFiscal) AS ncmp_pro, item.codMaterial->unidadeMedida AS unid_pro, null AS barr_pro, null AS cind_pro, null AS lote_ivn, (CASE WHEN item.classificacaoFiscal LIKE '12%' THEN 'S' ELSE 'D' END) AS fsem_pro, null AS trat_pro, CAST(item.ValorCOFINS+item.valorICMS+item.valorIPI+item.valorPisPasepRec AS NUMERIC(18,4)) AS trib_ivn, null AS cond_cul, null AS desc_cul, null AS crec_inv, null AS drec_ivn, CAST(item.valorTotalItem AS NUMERIC(18,4)) AS pbru_ivn, CAST(item.valorTotalItem-((nota.descontosBonificacao+nota.valorFreteConhecimento)/(SELECT COUNT(ID) FROM Est.NotaFiscalEntradaItens WHERE numDocumento=nota.NumDocumento AND codSerie=nota.codSerie AND codFornecedor=nota.fornecedor)) AS NUMERIC(18,4)) AS pliq_ivn, CAST(item.quantidade AS NUMERIC(18,3)) AS qtde_ivn, null AS codi_ved, null AS nome_ved, null AS cpfc_ved, null AS enco_ivn, null AS nume_ivn, null AS bair_ivn, null AS comp_ivn, null AS cepc_ivn, STRING(ibge.codIBGE) AS muni_ivn, empresa.CNPJCPF AS cnpj_cli, empresa.inscEstadual AS insc_cli, empresa.nome AS nome_cli, empresa.endereco AS enco_cli, empresa.endereco AS nume_cli, empresa.bairro AS bair_cli, null AS comp_cli, empresa.CEP AS cepc_cli, STRING(ibge.codIBGE) AS muni_cli, empresa.telefone AS tele_cli, null AS tel2_cli, null AS celu_cli, "sac@rical.com.br" AS email_cli, %ODBCOUT(dataRegistro) AS duma_cli, null AS dnac_cli FROM Est.NotaFiscalEntrada AS nota JOIN Est.NotaFiscalEntradaItens AS item ON nota.codEmpresa=item.codEmpresa AND nota.numDocumento=item.numDocumento AND nota.codSerie=item.codSerie JOIN Cpg.Fornecedor AS fornecedor ON nota.fornecedor=fornecedor.codigo AND nota.codEmpresa=fornecedor.codEmpresa JOIN Est.NotaFiscalEntradaChavElet AS chave ON chave.codSerie=nota.codSerie AND chave.fornecedor=nota.fornecedor AND chave.numDocumento=nota.numDocumento AND chave.fornecedor=nota.fornecedor JOIN Cad.Empresa as empresa ON empresa.ID=nota.codEmpresa JOIN Cad.Cidade AS ibge ON ibge.ID=SUBSTRING(fornecedor.cep,1,5) WHERE nota.codEmpresa=${id} AND %ODBCOUT(nota.especieDocumento) IN (1,3) AND item.codMaterial in (SELECT codItem FROM Cgi.MascSaida WHERE {fn LEFT(mascara,2)}="12") AND nota.dataEmissao>=DATE("${dateStart}") AND nota.dataEmissao<=DATE("${dateEnd}")`,
    // };
  }
}
