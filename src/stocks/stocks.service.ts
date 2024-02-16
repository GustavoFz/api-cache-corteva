import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class StocksService {
  constructor(private db: DbService) {}

  async findOne(id: number, dateStart: string, dateEnd: string) {
    const company = [1, 2];

    if (!company.includes(id)) {
      throw new NotFoundException();
    }

    const r = /^\d{4}-\d{2}-\d{2}$/;
    if (!r.test(dateStart) || !r.test(dateEnd)) {
      throw new BadRequestException();
    }

    const date1 = new Date(dateStart);
    const date2 = new Date(dateEnd);

    if (date1 > date2) {
      throw new BadRequestException();
    }
    // Naturaza 8 Produtos revenda
    // Caso esteja usando MySql Version 5.7.5 ou superior, desabilitar ONLY_FULL_GROUP_BY

    const select = `
      SELECT 
        mov.codEmpresa AS codi_rev, 
        item.marca AS codi_fab,
        mov.codItem AS codi_pro,
        item.ncm AS ncmp_pro,
        item.nome AS desc_pro,
        item.unidMedida AS unid_pro,
        null AS barr_pro,
        null AS cind_pro,
        DATE_FORMAT(mov.dataLancamento, "%Y-%m-%d") AS date_pro,
        null AS lote_pro,
        GREATEST(SUM(CASE WHEN operacao = 0 THEN -mov.qtdItem ELSE mov.qtdItem END), 0, 0) AS qtde_prod, 
        GREATEST(SUM(CASE WHEN operacao = 0 THEN -mov.qtdItem ELSE mov.qtdItem END), 0, 0) AS qtdi_pro, 
        0 AS qttr_pro, 
        0 AS qtbl_pro, 
        null AS trat_pro, 
        item.tipo AS fsem_pro 
      FROM 
        movimentacao AS mov
      JOIN 
        item
          ON item.id=mov.codItem
      WHERE 
        codEmpresa=${id} AND dataLancamento BETWEEN "${dateStart}" AND "${dateEnd}" 
      GROUP BY 
        mov.codItem 
      ORDER BY 
        datalancamento DESC`;

    return this.db.mysqlSelect(select);
  }
}
