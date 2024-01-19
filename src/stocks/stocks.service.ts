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
    // %EXTERNAL %INTERNAL %ODBCOUT
    // exemplos TO_CHAR(dataLcto,'YYYY-MM-DD') e %ODBCOUT(dataLcto)

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
