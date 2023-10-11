import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        auth: {
          username: configService.get<string>('API_USERNAME'),
          password: configService.get<string>('API_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [HttpModule],
})
export class GlobalhttpmoduleModule {}
