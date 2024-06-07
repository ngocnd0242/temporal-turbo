import { OrderService } from './order.service';
import { NativeConnection, Worker } from '@temporalio/worker';
import { taskQueueOrder } from './shared/constants';

export const transferWorkerProviders = [
  {
    provide: 'TRANSFER_WORKER',
    inject: [OrderService],
    useFactory: async (svc: OrderService) => {
      const activities = {
        order: svc.order.bind(svc),
        revertOrder: svc.revertOrder.bind(svc),
        notifyOrder: svc.notifyOrder.bind(svc),
        revertNotifyOrder: svc.revertNotifyOrder.bind(svc),
      };

      const connection = await NativeConnection.connect({
        address: 'temporal:7233',
        // TLS and gRPC metadata configuration goes here.
      });

      const worker = await Worker.create({
        connection,
        taskQueue: taskQueueOrder,
        activities,
      });

      await worker.run();
      console.log('Started worker!');

      return worker;
    },
  },
];
