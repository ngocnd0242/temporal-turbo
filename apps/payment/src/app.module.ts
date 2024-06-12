import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AppService } from './app.service';
import { paymentWorkerProviders } from './app.providers';

@Module({
  imports: [],
  controllers: [],
  providers: [PaymentService, ...paymentWorkerProviders, AppService],
})
export class AppModule {}
