import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class CustomersService {
  constructor(private db: DbService) {}

  async findOne(id: number) {
    //idTipoNota=61 é referente as notas emitidas pelo portal do produtor

    const select = `
    SELECT 
      CONCAT(codEmpresa, '') AS codi_rev,
      CONCAT(codigo, '') AS codi_cli,
      cnpjCpf AS cnpj_cli,
      inscEstadual AS insc_cli,
      razaoSocial AS nome_cli,
      endereco AS enco_cli,
      numeroEndereco AS nume_cli,
      bairro AS bair_cli,
      null AS comp_cli,
      cep AS cepc_cli,
      codigoIbge AS muni_cli,
      telefone AS tele_cli,
      celular AS tel2_cli,
      celular AS celu_cli,
      email AS emai_cli,
      DATE_FORMAT(dataRegistro, "%Y-%m-%d") AS duma_cli,
      null AS dnac_cli 
    FROM 
      cliente_empresa
    WHERE 
      codEmpresa=${id}
    AND
      codigo!=${id}
    `;

    return await this.db.mysqlSelect(select);
  }
}
