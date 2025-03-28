import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class StocksService {
  constructor(private db: DbService) {}

  async findOne(id: number, dateStart: string, dateEnd: string) {
    // Naturaza 8 Produtos revenda
    // Caso esteja usando MySql Version 5.7.5 ou superior, desabilitar ONLY_FULL_GROUP_BY
    // WHERE ALTERADO PARA SEMPRE TRAZER O ESTOQUE DO DIA DA CONSULTA IGNORANDO O PARAMETRO DATE
    // codEmpresa=${id} AND item.marca="CORTEVA" AND dataLancamento BETWEEN "${dateStart}" AND "${dateEnd}"

    const select = `
      SELECT 
        CONCAT(mov.codEmpresa, '') AS codi_rev, 
        item.marca AS codi_fab,
        CONCAT(mov.codItem, '') AS codi_pro,
        item.ncm AS ncmp_pro,
        item.nome AS desc_pro,
        item.unidMedida AS unid_pro,
        null AS barr_pro,
        null AS cind_pro,
        DATE_FORMAT(DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 4 HOUR), "%Y-%m-%d")  AS date_pro,
        null AS lote_pro,
        GREATEST(SUM(CASE WHEN operacao = 0 THEN -mov.qtdItem ELSE mov.qtdItem END), 0, 0) AS qtde_pro, 
        GREATEST(SUM(CASE WHEN operacao = 0 THEN -mov.qtdItem ELSE mov.qtdItem END), 0, 0) AS qtdi_pro, 
        '0.000' AS qttr_pro, 
        '0.000' AS qtbl_pro, 
        null AS trat_pro, 
        item.tipo AS fsem_pro 
      FROM 
        movimentacao AS mov
      RIGHT JOIN 
        item
          ON mov.codItem=item.id
      WHERE 
        codEmpresa=${id} AND item.marca="CORTEVA" 
      GROUP BY 
        mov.codItem 
      ORDER BY 
        datalancamento DESC`;

    return await this.db.mysqlSelect(select);
  }
}
