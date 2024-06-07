import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { OrderService } from './order.service';
import { transferWorkerProviders } from './app.providers';

@Module({
  imports: [],
  controllers: [],
  providers: [OrderService, ...transferWorkerProviders, AppService],
})
export class AppModule {}
