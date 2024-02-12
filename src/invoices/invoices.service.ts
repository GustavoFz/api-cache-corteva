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

    const data = await this.db.mysqlSelect(
      `SELECT
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
       item.marcaItem AS codi_fab,
       "55" AS modl_ven,
       empresa.cnpjCpf AS emit_ven,
       nota.numero AS nume_ven,
       nota.codSerie AS seri_ven,
       nota.chave AS chav_ven,
       nota.codTipoNota AS fina_ven,
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
       nota.cfop oper_ven,
       nota.cfop AS cfop_ven,
       IF(nota.situacao=2, "C", "A") AS stat_ven,
       cliente.cnpjCpf AS dest_ven,
       nota.descricao AS desc_opr,
       IF(mov.operacao=0, "S", "E") AS sina_opr,
       nota.codCliente AS codi_cli,
       item.codItem AS codi_pro,
       item.nomeItem AS desc_pro,
       item.ncm AS ncmp_pro,
       item.unidMedida AS unid_pro,
       NULL AS barr_pro,
       NULL AS cind_pro,
       NULL AS lote_ivn,
       IF(item.ncm LIKE "12%", "S", "D") AS fsem_pro,
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
           FROM movimentacao 
               WHERE movimentacao.codEmpresa = nota.codEmpresa AND movimentacao.numeroNota = nota.numero AND movimentacao.serieFiscal = nota.codSerie), DECIMAL(18,4)) 
       AS pliq_ivn,
       item.qtdItem AS qtde_ivn,
       null AS codi_ved,
       null AS nome_ved,
       null AS cpfc_ved,
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
       cliente.email AS email_cli,
       DATE_FORMAT(cliente.dataRegistro, "%Y-%m-%d") AS duma_cli,
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
            FROM movimentacao
            WHERE movimentacao.codEmpresa = nota.codEmpresa AND movimentacao.numeroNota = nota.numero AND movimentacao.serieFiscal = nota.codSerie) 
        AS teste_qtd_itens_nota,
       nota.id AS codi_ven,
       item.id as itemId,
       mov.id as movId,
       NULL AS codi_ped,
       nota.codEmpresa AS codi_rev,
       item.marcaItem AS codi_fab,
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
       nota.cfop oper_ven,
       nota.cfop AS cfop_ven,
       "A" AS stat_ven,
       fornecedor.cnpjCpf AS dest_ven,
       item.cfopDescricao AS desc_opr,
       IF(mov.operacao=0, "S", "E") AS sina_opr,
       nota.codFornecedor AS codi_cli,
       item.codItem AS codi_pro,
       item.nomeItem AS desc_pro,
       item.ncm AS ncmp_pro,
       item.unidMedida AS unid_pro,
       NULL AS barr_pro,
       NULL AS cind_pro,
       NULL AS lote_ivn,
       IF(item.ncm LIKE "12%", "S", "D") AS fsem_pro,
       NULL AS trat_pro,
       CONVERT(((item.vlrCofins + item.vlrIcms + item.vlrPis + item.vlrIpi)*item.percItemNota)/100, DECIMAL(18,4)) AS trib_ivn,
       NULL AS cond_cul,
       NULL AS desc_cul,
       NULL AS crec_inv,
       NULL AS drec_ivn,
       item.vlrItem AS pbru_ivn,
       CONVERT(item.vlrCustoEntrada*item.qtdItem, DECIMAL(18,4)) AS pliq_ivn,
       item.qtdItem AS qtde_ivn,
       null AS codi_ved,
       null AS nome_ved,
       null AS cpfc_ved,
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
       empresa.email AS email_cli,
       DATE_FORMAT(empresa.dataRegistro, "%Y-%m-%d") AS duma_cli,
       NULL AS dnac_cli
       FROM
           movimentacao AS mov
       JOIN notaEntrada AS nota
           ON mov.codEmpresa=nota.codEmpresa AND nota.numero=mov.numeroNota AND nota.codSerie=mov.serieFiscal AND nota.codFornecedor=mov.codFornecedor AND nota.dataEntrada=mov.dataLancamento
       JOIN itemNotaEntrada AS item 
           ON item.codFornecedor=mov.codFornecedor AND item.codItem=mov.codItem AND item.numeroNota=mov.numeroNota AND item.codEmpresa=mov.codEmpresa AND mov.serieFiscal=item.serieNota AND mov.dataLancamento=item.dataEntrada AND mov.qtdItem=item.qtdItem AND item.vlrCustoEntrada=mov.vlrUnitario
       JOIN fornecedor ON nota.idFornecedor = fornecedor.id
       JOIN empresa ON mov.codEmpresa = empresa.id
       WHERE mov.codEmpresa=${id} AND dataLancamento BETWEEN '${dateStart}' AND '${dateEnd}'`,
    );

    return data;
  }
}
