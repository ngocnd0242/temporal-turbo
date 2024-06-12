import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { WorkflowClient } from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';
import { nanoid } from 'nanoid';

import { taskQueueOrderFlow } from '@repo/temporal/constants';
import { orderWorkflow } from '@repo/temporal/workflows';
import { CreateOrderReqDto } from './dtos/CreateOrderReqDto';
import { IOrder } from '@repo/temporal/types/index';

@Controller('/orders')
export class OrderController {
  constructor(
    @InjectTemporalClient() private readonly temporalClient: WorkflowClient,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async postOrder(@Body() data: CreateOrderReqDto): Promise<{
    status: number;
    orderId: string;
  }> {
    const id: string = nanoid();
    const order: IOrder = { ...data };
    order.id = id;

    const handle = await this.temporalClient.start(orderWorkflow, {
      args: [order],
      taskQueue: taskQueueOrderFlow,
      workflowId: `order-${id}`,
    });

    console.log(`Started orderWorkflow ${handle.workflowId}`);

    return {
      status: 200,
      orderId: `order-${id}`,
    };
  }
}
