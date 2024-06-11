import { NativeConnection, Worker } from '@temporalio/worker';
import { taskQueueOrderFlow } from '@repo/temporal/constants';

export const wfWorkerProviders = [
  {
    provide: 'WF_WORKER',
    useFactory: async () => {
      const connection = await NativeConnection.connect({
        address: 'temporal:7233',
      });

      const worker = await Worker.create({
        connection,
        taskQueue: taskQueueOrderFlow,
        workflowsPath: require.resolve(
          './../../../../packages/temporal/workflows/order/index.ts',
        ),
      });

      await worker.run();
      console.log('Started workflow worker!');

      return worker;
    },
  },
];
