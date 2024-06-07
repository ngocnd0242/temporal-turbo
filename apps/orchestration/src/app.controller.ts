import { Controller, Get } from '@nestjs/common';
import {
  WorkflowClient,
  WorkflowExecutionAlreadyStartedError,
} from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';
import { taskQueueA, taskQueueB } from './shared/constants';
import { ITransfer } from './shared/types';

@Controller('transfers')
export class AppController {
  constructor(
    @InjectTemporalClient() private readonly temporalClient: WorkflowClient,
  ) {}

  @Get()
  async getTransfer(): Promise<string | undefined> {
    const paramsA: ITransfer = {
      amount: 30,
      fromUser: 'C',
      toUser: 'A',
      referenceID: '0001',
    };

    const paramsB: ITransfer = {
      amount: 40,
      fromUser: 'C',
      toUser: 'B',
      referenceID: '0002',
    };

    const amountC: number = 100;
    let rs: string = `C: $${amountC}\nA: $30\nB: $0\n\n`;

    try {
      const handleA = await this.temporalClient.start('transferWorkflow', {
        args: [paramsA],
        taskQueue: taskQueueA,
        workflowId: 'wf-id-' + Math.floor(Math.random() * 1000),
      });

      console.log(`Started workflow A ${handleA.workflowId}`);
      rs += 'svc A Handle:' + (await handleA.result());
      rs += `C: $${amountC - 30}\nA: $30\nB: $0\n\n\n`;

      const handleB = await this.temporalClient.start('transferWorkflow', {
        args: [paramsB],
        taskQueue: taskQueueB,
        workflowId: 'wf-id-' + Math.floor(Math.random() * 1000),
      });
      console.log(`Started workflow B ${handleB.workflowId}`);

      rs += 'svc B Handle:' + (await handleB.result());
      rs += `C: $${amountC - 30 - 40}\nA: $30\nB: $40\n\n\n`;
    } catch (err) {
      if (err instanceof WorkflowExecutionAlreadyStartedError) {
        console.log('Reusing existing exchange rates workflow');
      } else {
        process.exit(1);
        throw err;
      }
      process.exit(1);
    }

    return `<p style="white-space: pre-line">${rs}</p>`;
  }
}
