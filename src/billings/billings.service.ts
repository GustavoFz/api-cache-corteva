import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class BillingsService {
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
      YEAR(mov.dataLancamento) AS ano_ven, 
      MONTH(mov.dataLancamento) AS mes_ven, 
      "55" AS modl_ven, 
      nota.id AS oper_ven, 
      itemNota.cfop AS cfop_ven, 
      nat.nome AS desc_oper, 
      item.ncm AS ncmp_pro, 
      IF(mov.operacao=0, "S", "E") AS sina_opr, 
      SUM(CASE WHEN nota.codEmitente IN (204,216,224,610,621,622,2883,6382,10086,11111,11192,32586,32835) AND nota.idDestinatario IN (1,2) THEN itemNota.vlrTotal WHEN nota.idEmitente IN (1,2) AND nota.codDestinatario IN ("1||10264","1||11","1||12665","1||22","1||3","1||60","1||64","1||66","1||7085","1||77","1||8367","2|| 10264","2||11","2||12665","2||22","2||3","2||60","2||64","2||66","2||7085","2||77","2||8367") THEN itemNota.vlrTotal ELSE 0 END) AS valf_ven, 

      SUM(CASE WHEN nota.codEmitente IN (204,216,224,610,621,622,2883,6382,10086,11111,11192,32586,32835) AND nota.idDestinatario IN (1,2) THEN itemNota.qtd WHEN nota.idEmitente IN (1,2) AND nota.codDestinatario IN ("1||10264","1||11","1||12665","1||22","1||3","1||60","1||64","1||66","1||7085","1||77","1||8367","2|| 10264","2||11","2||12665","2||22","2||3","2||60","2||64","2||66","2||7085","2||77","2||8367") THEN itemNota.qtd ELSE 0 END) AS volf_ven,

      SUM(CASE WHEN nota.codEmitente NOT IN (204,216,224,610,621,622,2883,6382,10086,11111,11192,32586,32835) AND nota.codDestinatario NOT IN ("1||10264","1||11","1||12665","1||22","1||3","1||60","1||64","1||66","1||7085","1||77","1||8367","2|| 10264","2||11","2||12665","2||22","2||3","2||60","2||64","2||66","2||7085","2||77","2||8367") THEN itemNota.vlrTotal ELSE 0 END) AS volu_ven,

      SUM(CASE WHEN nota.codEmitente NOT IN (204,216,224,610,621,622,2883,6382,10086,11111,11192,32586,32835) AND nota.codDestinatario NOT IN ("1||10264","1||11","1||12665","1||22","1||3","1||60","1||64","1||66","1||7085","1||77","1||8367","2|| 10264","2||11","2||12665","2||22","2||3","2||60","2||64","2||66","2||7085","2||77","2||8367") THEN itemNota.qtd ELSE 0 END) AS volr_ven      
    FROM 
      movimentacao2 AS mov
    JOIN 
      notaFiscal2 AS nota
        ON mov.numeroNota=nota.numero AND mov.codEmpresa=nota.codEmpresa AND mov.serieFiscal=nota.serie AND mov.idFornecedor=nota.idEmitente
    JOIN 
      itemNotaFiscal2 AS itemNota 
        ON itemNota.codigo=mov.codItem AND itemNota.numeroNota=mov.numeroNota AND itemNota.idEmpresa=mov.codEmpresa AND mov.idFornecedor=itemNota.idEmitente 
    JOIN 
      naturezaOperacao AS nat
        ON itemNota.cfop=nat.id
    JOIN 
      item
        ON itemNota.codigo=item.id
    WHERE 
      mov.codEmpresa=${id} AND mov.dataLancamento BETWEEN "${dateStart}" AND "${dateEnd}" 
    GROUP BY 
      codi_rev, mes_ven, ano_ven, oper_ven, cfop_ven, desc_oper, sina_opr, ncmp_pro ORDER BY mov.datalancamento DESC`;

    return this.db.mysqlSelect(select);
  }
}
