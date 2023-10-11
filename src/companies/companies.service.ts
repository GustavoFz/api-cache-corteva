import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly httpService: HttpService,
    private env: ConfigService,
  ) {}

  url = this.env.get<string>('API_DB_URL');

  async findAll() {
    const data = {
      query:
        "SELECT codigo as codi_rev, nome as raza_rev, nome as fant_rev, inscEstadual as inse_rev, CNPJCPF as cnpj_rev, (CASE WHEN codigo=1 THEN '1100122' WHEN codigo=2 THEN '1100304' END) as muni_rev, telefone as fone_rev, 'sac@rical.com.br' as mail_rev FROM Cad.Empresa WHERE codigo IN (1,2)",
    };

    const response = await firstValueFrom(
      this.httpService.post(this.url, data),
    );

    return response.data.result.content;
  }

  async findOne(id: number) {
    const company = [1, 2];
    const data = {
      query:
        "SELECT codigo as codi_rev, nome as raza_rev, nome as fant_rev, inscEstadual as inse_rev, CNPJCPF as cnpj_rev, (CASE WHEN codigo=1 THEN '1100122' WHEN codigo=2 THEN '1100304' END) as muni_rev, telefone as fone_rev, 'sac@rical.com.br' as mail_rev FROM Cad.Empresa WHERE codigo =" +
        id,
    };

    if (!company.includes(id)) {
      throw new NotFoundException();
    }

    const response = await firstValueFrom(
      this.httpService.post(this.url, data),
    );

    return response.data.result.content;
  }
}
