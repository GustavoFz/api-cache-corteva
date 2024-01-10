import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StocksService {
  constructor(
    private readonly httpService: HttpService,
    private env: ConfigService,
  ) {}

  url = this.env.get<string>('API_DB_URL');

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
    // Usar os metodos abaixo para alterar a saida dos dados
    // %EXTERNAL %INTERNA %ODBCOUT
    // exemplos TO_CHAR(dataLcto,'YYYY-MM-DD') e %ODBCOUT(dataLcto)
    // const data = {
    //   query: `SELECT codEmpresa as codi_rev, null as codi_fab, codItem as codi_pro, codItem->classificacaoFiscal->classificacaoFiscal as ncmp_pro, codItem->nome as desc_pro, codItem->unidadeMedida as unid_pro, null as barr_pro, null as cind_pro, %ODBCOUT(dataLcto) as date_pro, null as lote_pro, SUM(CASE WHEN operacao1='+' THEN qtdMovto ELSE -qtdMovto END) as qtde_pro, SUM(CASE WHEN operacao1='+' THEN qtdMovto ELSE -qtdMovto END) as qtdi_pro, null as qttr_pro, null as qtbl_pro, null as trat_pro, CASE WHEN codItem->classificacaoFiscal->classificacaoFiscal LIKE '12%' THEN 'S' ELSE 'D' END as fsem_pro FROM Est.Movimento WHERE codItem->classificacaoFiscal->classificacaoFiscal IN ('10070010', '12072100', '12072900', '10051000', '10059010', '10059090',  '12011000', '12019000', '12010010', '10071000', '10079000', '10011100', '10011900', '10019100', '10019900', '38089991', '38089992', '38089993', '34029029', '38089220', '38089291', '38089292', '38089293', '38089294', '38089295', '38089296', '38089297', '38089299', '38082029', '38089321', '38089322', '38089323', '38089324', '38089325', '38089326', '38089327', '38089328', '38089329', '38083021', '38083029', '38089331', '38089333', '38085021', '38085029', '38086290', '38089119', '38089120', '38089191', '38089192', '38089193', '38089194', '38089195', '38089196', '38089197', '38089198', '38089199', '38081029', '39269090', '44219900', '38089994', '38089995', '29333919', '38085010', '38089029', '38089110', '38089111', '38089211', '38089219', '38089311', '38089319', '38089332', '38089341', '38089349', '38089411', '38089419', '38089421', '38089422', '38089429', '38089911', '38089919', '38089920', '38089996', '38089999', '38089351', '38089352', '38089359', '38249929', '30029000') AND codItem->origem != 'Fabricação Própria' AND codEmpresa=${id} AND dataLcto>=DATE("${dateStart}") AND dataLcto<=DATE("${dateEnd}") AND codNatureza1 = 8 GROUP BY codItem ORDER BY dataLcto DESC`,
    // };
    const data = {
      query: `SELECT codEmpresa as codi_rev, null as codi_fab, codItem as codi_pro, codItem->classificacaoFiscal->classificacaoFiscal as ncmp_pro, codItem->nome as desc_pro, codItem->unidadeMedida as unid_pro, null as barr_pro, null as cind_pro, %ODBCOUT(dataLcto) as date_pro, null as lote_pro, +GREATEST(COALESCE(SUM(CASE WHEN operacao1='+' THEN qtdMovto ELSE -qtdMovto END), 0), 0) as qtde_pro, +GREATEST(COALESCE(SUM(CASE WHEN operacao1='+' THEN qtdMovto ELSE -qtdMovto END), 0), 0) as qtdi_pro, +0 as qttr_pro, +0 as qtbl_pro, null as trat_pro, CASE WHEN codItem->classificacaoFiscal->classificacaoFiscal LIKE '12%' THEN 'S' ELSE 'D' END as fsem_pro FROM Est.Movimento WHERE codItem in (SELECT codItem FROM Cgi.MascSaida WHERE {fn LEFT(mascara,2)}="12") AND codItem->origem != 'Fabricação Própria' AND codEmpresa=${id} AND dataLcto>=DATE("${dateStart}") AND dataLcto<=DATE("${dateEnd}") AND codNatureza1 = 8 GROUP BY codItem ORDER BY dataLcto DESC`,
    };
    const response = await firstValueFrom(
      this.httpService.post(this.url, data),
    );

    const produtos = response.data.result.content;
    //TROCA CAMPOS VAZIOS POR NULL
    return produtos.map((produto) => {
      for (const prop in produto) {
        if (produto[prop] === '') {
          produto[prop] = null;
        }
      }
      return produto;
    });
  }
}
