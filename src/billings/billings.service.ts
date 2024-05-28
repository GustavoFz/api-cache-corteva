import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class BillingsService {
  constructor(private db: DbService) {}

  async findOne(id: number, dateStart: string, dateEnd: string) {
    // Naturaza 8 Produtos revenda
    // Caso esteja usando MySql Version 5.7.5 ou superior, desabilitar ONLY_FULL_GROUP_BY

    const select = `
    SELECT 
      CONCAT(mov.codEmpresa, '') AS codi_rev, 
      CONCAT(YEAR(nota.dataEmissao), '') AS ano_ven, 
      CONCAT(MONTH(nota.dataEmissao), '') AS mes_ven, 
      "55" AS modl_ven, 
      itemNota.cfop AS oper_ven, 
      itemNota.cfop AS cfop_ven, 
      nat.nome AS desc_opr, 
      item.ncm AS ncmp_pro, 
      IF(mov.operacao=0, "S", "E") AS sina_opr, 
      CONVERT(SUM(CASE WHEN itemNota.cfop=5152 THEN itemNota.vlrTotal ELSE 0 END), DECIMAL(18,4)) AS valf_ven, 
      SUM(CASE WHEN itemNota.cfop=5152 THEN itemNota.qtd ELSE 0 END) AS volf_ven,
      CONVERT(SUM(CASE WHEN itemNota.cfop!=5152 THEN itemNota.vlrTotal ELSE 0 END), DECIMAL(18,4)) AS volu_ven,
      SUM(CASE WHEN itemNota.cfop!=5152 THEN itemNota.qtd ELSE 0 END) AS volr_ven      
    FROM 
      movimentacao AS mov
    JOIN 
      notaFiscal AS nota
        ON mov.numeroNota=nota.numero AND mov.codEmpresa=nota.codEmpresa AND mov.serieFiscal=nota.serie AND mov.idFornecedor=nota.idEmitente
    JOIN 
      itemNotaFiscal AS itemNota 
        ON itemNota.codigo=mov.codItem AND itemNota.numeroNota=mov.numeroNota AND itemNota.idEmpresa=mov.codEmpresa AND mov.idFornecedor=itemNota.idEmitente AND mov.qtdItem=itemNota.qtd
    JOIN 
      naturezaOperacao AS nat
        ON itemNota.cfop=nat.id
    JOIN 
      item
        ON itemNota.codigo=item.id
    WHERE 
      mov.codEmpresa=${id} AND nota.dataEmissao BETWEEN "${dateStart}" AND "${dateEnd}" 
    GROUP BY 
      codi_rev, mes_ven, ano_ven, oper_ven, cfop_ven, desc_opr, sina_opr, ncmp_pro ORDER BY nota.dataEmissao DESC
    `;

    return await this.db.mysqlSelect(select);
  }
}
