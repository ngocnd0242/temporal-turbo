import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { WorkflowClient } from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';

import { taskQueueOrderFlow } from './shared/constants';
import { IStoreOrderDto } from './shared/types';

@Controller('/orders')
export class OrderController {
  constructor(
    @InjectTemporalClient() private readonly temporalClient: WorkflowClient,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async postOrder(@Body() data: IStoreOrderDto): Promise<{
    status: number;
    orderId: string;
  }> {
    const id: string = (Math.random() + 1).toString(36).substring(2);
    // Create order from request
    const order: IStoreOrderDto = { ...data };
    order.id = id;

    // Register workflows
    const handle = await this.temporalClient.start('orderWorkflow', {
      args: [order],
      taskQueue: taskQueueOrderFlow,
      workflowId: 'wf-order-id-' + id,
    });

    console.log(`Started orderWorkflow ${handle.workflowId}`);

    return {
      status: 200,
      orderId: order.id,
    };
  }
}
