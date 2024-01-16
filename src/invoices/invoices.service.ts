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

    const data = {
      query: `SELECT nota.ID as codi_ven, nota.codPedido as codi_ped, STRING(nota.codEmpresa) as codi_rev, "obrigatório - nao temos" as codi_fab, "55" as modl_ven, nota.codEmpresa->CNPJCPF as emit_ven, STRING(nota.codNumNota) as nume_ven, nota.codSerie as seri_ven, chave.chaveAcesso as chav_ven, STRING(nota.codTipoDeNota->tipoFinalNfe+1) as fina_ven, %ODBCOUT(nota.dataEmissao) as data_ven, DATEADD('day',45,nota.dataEmissao) as datv_ven, null as obsv_ven, "obrigatorio" as orig_ven, "nota.codCondVenda - obrigatório - não controlamos" as codi_con, "(nota.CondicaoDeVenda->descricao) - obrigatório - não controlamos" as desc_con, "obrigatório - não controlamos" as tipo_con, "obrigatório - não controlamos" as praz_con, null as inde_ven, null as dind_ven, null as bund_ven, null as cota_ven, STRING(nota.codTipoDeNota) oper_ven, nota.codNatOperacao as cfop_ven, (CASE WHEN nota.situacao=2 THEN "A" WHEN nota.situacao=3 THEN "C" END) as stat_ven, cliente.CNPJCPF as dest_ven, nota.codTipoDeNota->descricao as desc_opr, (CASE WHEN (nota.codTipoDeNota->tipoFinalNfe+1)=4 THEN "S" ELSE "E" END) as sina_opr, nota.codCliente as codi_cli, item.codProduto as codi_pro, (item.codProduto->nome) as desc_pro, (item.codClassifFiscal->classificacaoFiscal) as ncmp_pro, (item.codProduto->unidadeMedida) as unid_pro, null as barr_pro, null as cind_pro, null as lote_ivn, (CASE WHEN item.codClassifFiscal->classificacaoFiscal LIKE '12%' THEN 'S' ELSE 'D' END) as fsem_pro, null as trat_pro, "obrigatório - VER COM THIGO" as trib_ivn, null as cond_cul, null as desc_cul, null as crec_inv, null as drec_ivn, "obrigatório - VER COM THIGO" as pbru_ivn, "obrigatório - VER COM THIGO" as pliq_ivn, "obrigatório" as qtde_ivn, "nota.codRepresentante - obrigatório - não controlamos" as codi_ved, "representante.nome - obrigatório - não controlamos" as nome_ved, "representante.CNPJCPF - obrigatório - não controlamos" as cpfc_ved, null as enco_ivn, null as nume_ivn, null as bair_ivn, null as comp_ivn, null as cepc_ivn, STRING(ibge.codIBGE) as muni_ivn, cliente.CNPJCPF as cnpj_cli, cliente.inscEstadual as insc_cli, cliente.nome as nome_cli, cliente.endereco as enco_cli, null as nume_cli, null as bair_cli, null as comp_cli, null as cepc_cli, STRING(ibge.codIBGE) as muni_cli, null as tele_cli, null as tel2_cli, null as celu_cli, cliente.email as email_cli, cliente.dataAlterSituacao as duma_cli, null as dnac_cli FROM Fat.NotaFiscal as nota INNER JOIN Fat.NotaFiscalItem as item ON nota.codNumNota=item.numero INNER JOIN Fat.NFPorChaveAcesso as chave ON chave.codEmpresa=nota.codEmpresa AND chave.numeroNota=nota.codNumNota INNER JOIN Fat.Cliente as cliente ON nota.Cliente=cliente.ID INNER JOIN Fat.Representante as representante ON nota.Representante=representante.ID INNER JOIN Cad.Cidade as ibge ON ibge.ID=SUBSTRING(cliente.cep,1,5) WHERE nota.codEmpresa=${id} AND item.codProduto in (SELECT codItem FROM Cgi.MascSaida WHERE {fn LEFT(mascara,2)}="12") AND nota.dataEmissao>=DATE("${dateStart}") AND nota.dataEmissao<=DATE("${dateEnd}")`,
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
