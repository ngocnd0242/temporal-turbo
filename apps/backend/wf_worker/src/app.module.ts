import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { wfWorkerProviders } from './app.providers';

@Module({
  imports: [],
  controllers: [],
  providers: [AppService, ...wfWorkerProviders],
})
export class AppModule {}
