import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly httpService: HttpService,
    private env: ConfigService,
  ) {}

  url = this.env.get<string>('API_DB_URL');

  async findOne(id: number, dateStart: string, dateEnd: string) {
    const company = [1, 2];

    // const data = {
    //   query: `SELECT ID as codi_ven, codPedido as codi_ped, codEmpresa as codi_rev, null as codi_fab, "55" as modl_ven, null as emit_ven, null as nume_ven, codSerie as seri_ven, null as chav_ven, (codTipoDeNota->tipoFinalNfe+1) as fina_ven, %ODBCOUT(dataEmissao) as data_ven, null as datv_ven, null as obsv_ven, null as orig_ven, null as codi_con, null as desc_con, null as tipo_con, null as praz_con, null as inde_ven, null as dind_ven, null as bund_ven, null as cota_ven, null oper_ven, null as cfop_ven, null as stat_ven, null as dest_ven, null as desc_opr, null as sina_opr, codCliente as codi_cli, null as codi_pro, null as desc_pro, null as ncmp_pro, null as unid_pro, null as barr_pro, null as cind_pro, null as lote_ivn, null as fsem_pro, null as trat_pro, null as trib_ivn, null as cond_cul, null as desc_cul, null as crec_inv, null as drec_ivn, null as pbru_ivn FROM Fat.NotaFiscal WHERE dataEmissao>=DATE("${dateStart}") AND dataEmissao<=DATE("${dateEnd}") AND codPedido in (SELECT codPedido FROM ped.pedido WHERE codEmpresa=${id} AND nomeOper='Gerado via portal do produtor')`,
    // };

    // const data = {
    //   query: `SELECT fatItem.codProduto, fat.ID as codi_ven, fat.codPedido as codi_ped, fat.codEmpresa as codi_rev, null as codi_fab, "55" as modl_ven, null as emit_ven, null as nume_ven, fat.codSerie as seri_ven, null as chav_ven, (fat.codTipoDeNota->tipoFinalNfe+1) as fina_ven, %ODBCOUT(fat.dataEmissao) as data_ven, null as datv_ven, null as obsv_ven, "obrigatorio" as orig_ven, null as codi_con, null as desc_con, null as tipo_con, null as praz_con, null as inde_ven, null as dind_ven, null as bund_ven, null as cota_ven, fat.codTipoDeNota oper_ven, fat.codNatOperacao as cfop_ven, (CASE WHEN fat.situacao=2 THEN "A" WHEN fat.situacao=3 THEN "C" END) as stat_ven, fat.Cliente->CNPJCPF as dest_ven, fat.codTipoDeNota->descricao as desc_opr, "obrigatorio" as sina_opr, fat.codCliente as codi_cli, null as codi_pro, null as desc_pro, null as ncmp_pro, null as unid_pro, null as barr_pro, null as cind_pro, null as lote_ivn, null as fsem_pro, null as trat_pro, null as trib_ivn, null as cond_cul, null as desc_cul, null as crec_inv, null as drec_ivn, null as pbru_ivn, null as pliq_ivn, null as qtde_ivn, null as codi_ved, null as nome_ved, null as cpfc_ved, null as enco_ivn, null as nume_ivn, null as bair_ivn, null as comp_ivn, null as cepc_ivn, null as muni_ivn, null as cnpj_cli, null as insc_cli, null as nome_cli, null as enco_cli, null as nume_cli, null as bair_cli, null as comp_cli, null as cepc_cli, null as muni_cli, null as tele_cli, null as tel2_cli, null as celu_cli, null as email_cli, null as duma_cli, null as dnac_cli FROM Fat.NotaFiscal as fat INNER JOIN fat.NotaFiscalItem as fatItem ON fat.codNumNota=fatItem.numero WHERE fat.codEmpresa=${id} AND fat.dataEmissao>=DATE("${dateStart}") AND fat.dataEmissao<=DATE("${dateEnd}") AND fatItem.codProduto in (SELECT codItem FROM Cgi.MascSaida WHERE {fn LEFT(mascara,2)}="12")`,
    // };

    const data = {
      query: `SELECT fat.ID as codi_ven, fat.codPedido as codi_ped, fat.codEmpresa as codi_rev, null as codi_fab, "55" as modl_ven, fat.codEmpresa->CNPJCPF as emit_ven, fat.codNumNota as nume_ven, fat.codSerie as seri_ven, STRING((SELECT chaveAcesso FROM Fat.NFPorChaveAcesso WHERE codEmpresa=fat.codEmpresa AND numeroNota=fat.codNumNota)) as chav_ven, (fat.codTipoDeNota->tipoFinalNfe+1) as fina_ven, %ODBCOUT(fat.dataEmissao) as data_ven, DATEADD('day',45,fat.dataEmissao) as datv_ven, null as obsv_ven, "obrigatorio" as orig_ven, null as codi_con, null as desc_con, null as tipo_con, null as praz_con, null as inde_ven, null as dind_ven, null as bund_ven, null as cota_ven, fat.codTipoDeNota oper_ven, fat.codNatOperacao as cfop_ven, (CASE WHEN fat.situacao=2 THEN "A" WHEN fat.situacao=3 THEN "C" END) as stat_ven, fat.Cliente->CNPJCPF as dest_ven, fat.codTipoDeNota->descricao as desc_opr, "obrigatorio" as sina_opr, fat.codCliente as codi_cli, fatItem.codProduto as codi_pro, null as desc_pro, null as ncmp_pro, null as unid_pro, null as barr_pro, null as cind_pro, null as lote_ivn, null as fsem_pro, null as trat_pro, null as trib_ivn, null as cond_cul, null as desc_cul, null as crec_inv, null as drec_ivn, null as pbru_ivn, null as pliq_ivn, null as qtde_ivn, null as codi_ved, null as nome_ved, null as cpfc_ved, null as enco_ivn, null as nume_ivn, null as bair_ivn, null as comp_ivn, null as cepc_ivn, null as muni_ivn, null as cnpj_cli, null as insc_cli, null as nome_cli, null as enco_cli, null as nume_cli, null as bair_cli, null as comp_cli, null as cepc_cli, null as muni_cli, null as tele_cli, null as tel2_cli, null as celu_cli, null as email_cli, null as duma_cli, null as dnac_cli FROM Fat.NotaFiscal as fat INNER JOIN fat.NotaFiscalItem as fatItem ON fat.codNumNota=fatItem.numero WHERE fat.codEmpresa=${id} AND fatItem.codProduto in (SELECT codItem FROM Cgi.MascSaida WHERE {fn LEFT(mascara,2)}="12") AND fat.dataEmissao>=DATE("${dateStart}") AND fat.dataEmissao<=DATE("${dateEnd}")`,
    };

    if (!company.includes(id)) {
      throw new NotFoundException();
    }

    const response = await firstValueFrom(
      this.httpService.post(this.url, data),
    );

    const invoices = response.data.result.content;
    //TROCA CAMPOS VAZIOS POR NULL
    return invoices.map((invoice) => {
      for (const prop in invoice) {
        if (invoice[prop] === '') {
          invoice[prop] = null;
        }
      }
      return invoice;
    });
  }
}
