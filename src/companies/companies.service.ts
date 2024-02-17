import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class CompaniesService {
  constructor(private db: DbService) {}

  async findOne(id: number) {
    const company = [1, 2];

    if (!company.includes(id)) {
      id = 0;
    }

    const select = `
    SELECT 
      id as codi_rev, 
      razaoSocial as raza_rev, 
      'RICAL' as fant_rev, 
      inscEstadual as inse_rev, 
      cnpjCpf as cnpj_rev, 
      codigoIbge as muni_rev, 
      telefone as fone_rev, 
      email as mail_rev 
    FROM 
      empresa 
    WHERE 
      id=${id}`;

    const resp = await this.db.mysqlSelect(select);

    return resp;
  }
}
