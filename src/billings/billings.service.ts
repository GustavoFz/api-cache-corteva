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
      CONCAT(YEAR(mov.dataLancamento), '') AS ano_ven, 
      CONCAT(MONTH(mov.dataLancamento), '') AS mes_ven, 
      "55" AS modl_ven, 
      itemNota.cfop AS oper_ven, 
      itemNota.cfop AS cfop_ven, 
      nat.nome AS desc_opr, 
      item.ncm AS ncmp_pro, 
      IF(mov.operacao=0, "S", "E") AS sina_opr, 
      CONVERT(SUM(CASE WHEN nota.codEmitente IN (204,216,224,610,621,622,2883,6382,10086,11111,11192,32586,32835) AND nota.idDestinatario IN (1,2) THEN itemNota.vlrTotal WHEN nota.idEmitente IN (1,2) AND nota.codDestinatario IN ("1||10264","1||11","1||12665","1||22","1||3","1||60","1||64","1||66","1||7085","1||77","1||8367","2|| 10264","2||11","2||12665","2||22","2||3","2||60","2||64","2||66","2||7085","2||77","2||8367") THEN itemNota.vlrTotal ELSE 0 END), DECIMAL(18,4)) AS valf_ven, 

      SUM(CASE WHEN nota.codEmitente IN (204,216,224,610,621,622,2883,6382,10086,11111,11192,32586,32835) AND nota.idDestinatario IN (1,2) THEN itemNota.qtd WHEN nota.idEmitente IN (1,2) AND nota.codDestinatario IN ("1||10264","1||11","1||12665","1||22","1||3","1||60","1||64","1||66","1||7085","1||77","1||8367","2|| 10264","2||11","2||12665","2||22","2||3","2||60","2||64","2||66","2||7085","2||77","2||8367") THEN itemNota.qtd ELSE 0 END) AS volf_ven,

      CONVERT(SUM(CASE WHEN nota.codEmitente NOT IN (204,216,224,610,621,622,2883,6382,10086,11111,11192,32586,32835) AND nota.codDestinatario NOT IN ("1||10264","1||11","1||12665","1||22","1||3","1||60","1||64","1||66","1||7085","1||77","1||8367","2|| 10264","2||11","2||12665","2||22","2||3","2||60","2||64","2||66","2||7085","2||77","2||8367") THEN itemNota.vlrTotal ELSE 0 END), DECIMAL(18,4)) AS volu_ven,

      SUM(CASE WHEN nota.codEmitente NOT IN (204,216,224,610,621,622,2883,6382,10086,11111,11192,32586,32835) AND nota.codDestinatario NOT IN ("1||10264","1||11","1||12665","1||22","1||3","1||60","1||64","1||66","1||7085","1||77","1||8367","2|| 10264","2||11","2||12665","2||22","2||3","2||60","2||64","2||66","2||7085","2||77","2||8367") THEN itemNota.qtd ELSE 0 END) AS volr_ven      
    FROM 
      movimentacao AS mov
    JOIN 
      notaFiscal AS nota
        ON mov.numeroNota=nota.numero AND mov.codEmpresa=nota.codEmpresa AND mov.serieFiscal=nota.serie AND mov.idFornecedor=nota.idEmitente
    JOIN 
      itemNotaFiscal AS itemNota 
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
      codi_rev, mes_ven, ano_ven, oper_ven, cfop_ven, desc_opr, sina_opr, ncmp_pro ORDER BY mov.datalancamento DESC
    `;

    return await this.db.mysqlSelect(select);
  }
}
