import { PaymentService } from './payment.service';
import { NativeConnection, Worker } from '@temporalio/worker';
import { taskQueuePayment } from './shared/constants';

export const paymentWorkerProviders = [
  {
    provide: 'TRANSFER_WORKER',
    inject: [PaymentService],
    useFactory: async (svc: PaymentService) => {
      const activities = {
        payment: svc.payment.bind(svc),
        revertPayment: svc.revertPayment.bind(svc),
        notifyPayment: svc.notifyPayment.bind(svc),
        revertNotifyPayment: svc.revertNotifyPayment.bind(svc),
      };

      const connection = await NativeConnection.connect({
        address: 'temporal:7233',
        // TLS and gRPC metadata configuration goes here.
      });

      const worker = await Worker.create({
        connection,
        taskQueue: taskQueuePayment,
        activities,
      });

      await worker.run();
      console.log('Started worker!');

      return worker;
    },
  },
];
