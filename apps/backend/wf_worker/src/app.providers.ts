import { NativeConnection, Worker } from '@temporalio/worker';
import { taskQueueOrderFlow } from '@repo/temporal/src/constants';

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
        workflowsPath: require.resolve('@repo/temporal/workflow'),
      });

      await worker.run();
      console.log('Started workflow worker!');

      return worker;
    },
  },
];
