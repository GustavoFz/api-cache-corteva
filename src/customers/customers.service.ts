import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CustomersService {
  constructor(
    private readonly httpService: HttpService,
    private env: ConfigService,
  ) {}

  url = this.env.get<string>('API_DB_URL');

  async findOne(id: number) {
    const company = [1, 2];

    if (!company.includes(id)) {
      throw new NotFoundException();
    }

    const data = {
      query: `SELECT cli.codEmpresa as codi_rev, cli.codCliente as codi_cli, cli.CNPJCPF as cnpj_cli, cli.inscEstadual as insc_cli, cli.nome as nome_cli, cli.endereco as enco_cli, cli.enderecoNumero as nume_cli, cli.bairro as bair_cli, cli.endComplementar as comp_cli,cli.cep as cepc_cli, (SELECT codIBGE FROM Cad.Cidade WHERE codCEP=SUBSTRING(cli.cep,1,5)) as muni_cli, compl.telefone as tele_cli, compl.telefoneCobranca as tel2_cli, compl.telexCelular as celu_cli, cli.email as emai_cli, null as duma_cli, null as dnac_cli FROM fat.cliente cli INNER JOIN fat.CliComplemento2 compl ON cli.codCliente=compl.codCliente WHERE cli.codEmpresa=${id} AND cli.codCliente in (SELECT codCliente FROM ped.pedido WHERE codEmpresa=${id} AND situacao in (0,1,5) AND nomeOper='Gerado via portal do produtor' GROUP BY codCliente)`,
    };
    // "SELECT codPedido, codEmpresa, codRepresentante, procedencia, codTipoNota, dataDigitacao, dataEmissao, dataPrevFat, dataFaturamento, fatParcial, nomeOper, numNotaFiscal, pedProntEnt, situacao, qtdeItens, qtdPecasPedido, qtdPecasFaturadas FROM Ped.Pedido WHERE codEmpresa=1 AND situacao in (0,1,5) AND nomeOper='Gerado via portal do produtor'"
    const response = await firstValueFrom(
      this.httpService.post(this.url, data),
    );

    const clientes = response.data.result.content;
    return clientes.map((cliente) => {
      for (const prop in cliente) {
        if (cliente[prop] == '') {
          cliente[prop] = null;
        }
      }
      return cliente;
    });
  }
}
