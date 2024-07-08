import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class FaturamentoService {
  constructor(private readonly db: DbService) {}
  async findOne(id: number, dateStart: string, dateEnd: string) {
    const data = await this.db.mysqlSelect(`
    SELECT
      CONCAT(nota.codEmpresa, '') AS codi_rev,
      empresa.razaoSocial AS razao_social,
      empresa.cnpjCpf AS cnpj,
      CONCAT(empresa.cidade, '/', empresa.estado) AS municipio,
      nat.nome AS descricao_cfop,
      "VENDA" AS modalidade,
      item.nome AS descicao_produto,
      CONCAT(nota.numero, '') AS numero_nota,
      CONCAT(nota.serie, '') AS serie_nota,
      DATE_FORMAT(nota.dataEmissao, "%Y-%m-%d") AS data_ven,
      itemNota.cfop oper_ven,
      itemNota.cfop AS cfop_ven,
      IF(nota.situacao=2, "C", "A") AS stat_ven,
      IF(mov.operacao=0, "S", "E") AS sina_opr,
      nota.idDestinatario AS codi_cli,
      CONCAT(itemNota.codigo, '') AS codi_pro,
      itemNota.qtd AS quantidade_vendida,
      item.unidMedida AS unidade_medida,
      item.qtdEmbalagem AS volume_embalagem,
      (itemNota.qtd * item.qtdEmbalagem) AS quantidade_total,
      itemNota.vlrTotal AS pbru_ivn,
      cliente.cnpjCpf AS cnpj_cliente,
      cliente.cidade AS cidade_cliente
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
