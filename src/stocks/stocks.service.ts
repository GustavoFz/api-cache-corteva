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
    const ncmCorteva = [
      '10011100',
      '10011900',
      '10019100',
      '10019900',
      '10051000',
      '10059010',
      '10059090',
      '10070010',
      '10071000',
      '10079000',
      '12010010',
      '12011000',
      '12019000',
      '12072100',
      '12072900',
      '29333919',
      '30029000',
      '34029029',
      '38081029',
      '38082029',
      '38083021',
      '38083029',
      '38085010',
      '38085021',
      '38085029',
      '38086290',
      '38089029',
      '38089110',
      '38089111',
      '38089119',
      '38089120',
      '38089191',
      '38089192',
      '38089193',
      '38089194',
      '38089195',
      '38089196',
      '38089197',
      '38089198',
      '38089199',
      '38089211',
      '38089219',
      '38089220',
      '38089291',
      '38089292',
      '38089293',
      '38089294',
      '38089295',
      '38089296',
      '38089297',
      '38089299',
      '38089311',
      '38089319',
      '38089321',
      '38089322',
      '38089323',
      '38089324',
      '38089325',
      '38089326',
      '38089327',
      '38089328',
      '38089329',
      '38089331',
      '38089332',
      '38089333',
      '38089341',
      '38089349',
      '38089351',
      '38089352',
      '38089359',
      '38089411',
      '38089419',
      '38089421',
      '38089422',
      '38089429',
      '38089911',
      '38089919',
      '38089920',
      '38089991',
      '38089992',
      '38089993',
      '38089994',
      '38089995',
      '38089996',
      '38089999',
      '38249929',
      '39269090',
      '44219900',
    ];

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

    const select = `SELECT codEmpresa AS codi_rev, marcaItem AS codi_fab, codItem AS codi_pro, ncm AS ncmp_pro, nomeItem AS desc_pro, uniMedidaItem AS unid_pro, null AS barr_pro, null AS cind_pro, DATE_FORMAT(dataLancamento, "%Y-%m-%d") AS date_pro, null AS lote_pro, GREATEST(SUM(CASE WHEN operacao = 0 THEN -qtdItem ELSE qtdItem END), 0, 0) AS qtde_prod, GREATEST(SUM(CASE WHEN operacao = 0 THEN -qtdItem ELSE qtdItem END), 0, 0) AS qtdi_pro, 0 AS qttr_pro, 0 AS qtbl_pro, null AS trat_pro, IF(nomeItem LIKE 'SEM%', 'S', 'D') AS fsem_pro FROM movimentacao WHERE codEmpresa=${id} AND ncm IN (${ncmCorteva}) AND dataLancamento BETWEEN "${dateStart}" AND "${dateEnd}" GROUP BY codItem ORDER BY datalancamento DESC`;

    return this.db.mysqlSelect(select);
  }
}
