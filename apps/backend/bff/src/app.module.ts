import { Module } from '@nestjs/common';
import { TemporalModule } from 'nestjs-temporal';
import { Runtime } from '@temporalio/worker';
import { Connection } from '@temporalio/client';
import { OrderController } from './order.controller';
import { PaymentController } from './payment.controller';

@Module({
  imports: [
    // client modules
    TemporalModule.registerClientAsync({
      useFactory: async () => {
        Runtime.install({});
        const temporalHost = 'temporal:7233';
        const connection = await Connection.connect({
          address: temporalHost,
        });

        return {
          connection,
        };
      },
    }),
  ],
  controllers: [OrderController, PaymentController],
  providers: [],
})
export class AppModule {}
