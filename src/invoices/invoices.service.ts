import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class InvoicesService {
  constructor(private readonly db: DbService) {}
  async findOne(id: number, dateStart: string, dateEnd: string) {
    const data = await this.db.mysqlSelect(`
    SELECT
      CONCAT(mov.id, '') as codi_ven,
      CONCAT(nota.codPedido, '') AS codi_ped,
      CONCAT(nota.codEmpresa, '') AS codi_rev,
      CONCAT(item.marca, '') AS codi_fab,
      "55" AS modl_ven,
      empresa.cnpjCpf AS emit_ven,
      CONCAT(nota.numero, '') AS nume_ven,
      CONCAT(nota.serie, '') AS seri_ven,
      nota.chave AS chav_ven,
      CONCAT(nota.codNatOperacao, '') AS fina_ven,
      DATE_FORMAT(nota.dataEmissao, "%Y-%m-%d") AS data_ven,
      DATE_FORMAT(DATE_ADD(nota.dataEmissao, INTERVAL 45 DAY), "%Y-%m-%d") AS datv_ven,
      null AS obsv_ven,
      CONCAT(nfd.notaReferenciada, '.', nfd.serieReferenciada) AS orig_ven,
      null AS codi_con,
      null AS desc_con,
      null AS tipo_con,
      null AS praz_con,
      null AS inde_ven,
      null AS dind_ven,
      null AS bund_ven,
      null AS cota_ven,
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
      null AS barr_pro,
      null AS cind_pro,
      null AS lote_ivn,
      item.tipo AS fsem_pro,
      null AS trat_pro,
      CONVERT(itemNota.vlrCofins + itemNota.vlrIcms + itemNota.vlrPis, DECIMAL(18,4)) AS trib_ivn,
      null AS cond_cul,
      null AS desc_cul,
      null AS crec_inv,
      null AS drec_ivn,
      CONVERT(itemNota.vlrTotal, DECIMAL(18,4)) AS pbru_ivn,
      CONVERT(itemNota.vlrTotal - (itemNota.vlrDesconto + itemNota.vlrCofins + itemNota.vlrIcms + itemNota.vlrPis), DECIMAL(18,4)) 
      AS pliq_ivn,
      itemNota.qtd AS qtde_ivn,
      null AS codi_ved,
      null AS nome_ved,
      null AS cpfc_ved,
      null AS enco_ivn,
      null AS nume_ivn,
      null AS bair_ivn,
      null AS comp_ivn,
      null AS cepc_ivn,
      cliente.codigoIbge AS muni_ivn,
      cliente.cnpjCpf AS cnpj_cli,
      cliente.inscEstadual AS insc_cli,
      cliente.razaoSocial AS nome_cli,
      cliente.endereco AS enco_cli,
      cliente.numeroEndereco AS nume_cli,
      cliente.bairro AS bair_cli,
      null AS comp_cli,
      cliente.cep AS cepc_cli,
      cliente.codigoIbge AS muni_cli,
      cliente.telefone AS tele_cli,
      cliente.celular AS tel2_cli,
      cliente.celular AS celu_cli,
      cliente.email AS email_cli,
      DATE_FORMAT(cliente.dataRegistro, "%Y-%m-%d") AS duma_cli,
      null AS dnac_cli
      FROM
          movimentacao AS mov
      JOIN notaFiscal AS nota
       ON mov.numeroNota=nota.numero AND mov.codEmpresa=nota.codEmpresa AND mov.serieFiscal=nota.serie AND mov.idFornecedor=nota.idEmitente
      JOIN itemNotaFiscal AS itemNota
       ON itemNota.codigo=mov.codItem AND itemNota.numeroNota=mov.numeroNota AND itemNota.idEmpresa=mov.codEmpresa AND mov.idFornecedor=itemNota.idEmitente AND mov.qtdItem = itemNota.qtd
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
      WHERE mov.codEmpresa=${id} AND item.marca="CORTEVA" AND nota.dataEmissao BETWEEN '${dateStart}' AND '${dateEnd}'
    `);
    return data;
  }
}
