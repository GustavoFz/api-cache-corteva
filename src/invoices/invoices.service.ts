import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class InvoicesService {
  constructor(private readonly db: DbService) {}
  async findOne(id: number, dateStart: string, dateEnd: string) {
    const data = await this.db.mysqlSelect(`
    SELECT
      mov.id as codi_ven,
      CONCAT(nota.codPedido, '') AS codi_ped,
      CONCAT(nota.codEmpresa, '') AS codi_rev,
      item.marca AS codi_fab,
      "55" AS modl_ven,
      empresa.cnpjCpf AS emit_ven,
      CONCAT(nota.numero, '') AS nume_ven,
      CONCAT(nota.serie, '') AS seri_ven,
      nota.chave AS chav_ven,
      CONCAT(nota.codNatOperacao, '') AS fina_ven,
      DATE_FORMAT(nota.dataEmissao, "%Y-%m-%d") AS data_ven,
      DATE_FORMAT(DATE_ADD(nota.dataEmissao, INTERVAL 45 DAY), "%Y-%m-%d") AS datv_ven,
      NULL AS obsv_ven,
      CONCAT(nfd.notaReferenciada, '.', nfd.serieReferenciada) AS orig_ven,
      NULL AS codi_con,
      NULL AS desc_con,
      NULL AS tipo_con,
      NULL AS praz_con,
      NULL AS inde_ven,
      NULL AS dind_ven,
      NULL AS bund_ven,
      NULL AS cota_ven,
      itemNota.cfop oper_ven,
      itemNota.cfop AS cfop_ven,
      IF(nota.situacao=2, "C", "A") AS stat_ven,
      cliente.cnpjCpf AS dest_ven,
      nat.nome AS desc_opr,
      IF(mov.operacao=0, "S", "E") AS sina_opr,
      nota.idDestinatario AS codi_cli,
      CONCAT(itemNota.codigo, '') AS codi_pro,
      item.nome AS desc_pro,
      item.ncm AS ncmp_pro,
      item.unidMedida AS unid_pro,
      NULL AS barr_pro,
      NULL AS cind_pro,
      NULL AS lote_ivn,
      item.tipo AS fsem_pro,
      NULL AS trat_pro,
      itemNota.vlrCofins + itemNota.vlrIcms + itemNota.vlrPis + itemNota.vlrTributoNfc AS trib_ivn,
      NULL AS cond_cul,
      NULL AS desc_cul,
      NULL AS crec_inv,
      NULL AS drec_ivn,
      itemNota.vlrTotal AS pbru_ivn,
      CONVERT(itemNota.vlrTotal - (itemNota.vlrDesconto + itemNota.vlrCofins + itemNota.vlrIcms + itemNota.vlrPis + itemNota.vlrTributoNfc) /(
      SELECT 
          COUNT(ID) 
          FROM movimentacao 
              WHERE movimentacao.codEmpresa = nota.codEmpresa AND movimentacao.numeroNota = nota.numero AND movimentacao.serieFiscal = nota.serie), DECIMAL(18,4)) 
      AS pliq_ivn,
      itemNota.qtd AS qtde_ivn,
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
      JOIN notaFiscal AS nota
       ON mov.numeroNota=nota.numero AND mov.codEmpresa=nota.codEmpresa AND mov.serieFiscal=nota.serie AND mov.idFornecedor=nota.idEmitente
      JOIN itemNotaFiscal AS itemNota
       ON itemNota.codigo=mov.codItem AND itemNota.numeroNota=mov.numeroNota AND itemNota.idEmpresa=mov.codEmpresa AND mov.idFornecedor=itemNota.idEmitente
      JOIN item
       ON item.id=itemNota.codigo
      JOIN cliente_empresa AS cliente 
       ON nota.idDestinatario=cliente.id
      JOIN empresa 
       ON mov.codEmpresa=empresa.id
      JOIN naturezaOperacao AS nat
       ON itemNota.cfop=nat.id
      LEFT JOIN notaFiscalDevolucao AS nfd
       ON nfd.idEmpresa=nota.codEmpresa AND nfd.notaDevolucao=nota.numero
      WHERE mov.codEmpresa=${id} AND dataLancamento BETWEEN '${dateStart}' AND '${dateEnd}'
    `);
    return data;
  }
}
