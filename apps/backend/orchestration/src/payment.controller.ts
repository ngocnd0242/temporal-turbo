import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { WorkflowClient, WorkflowFailedError } from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';

import { IStorePaymentDto } from './shared/types';

@Controller('/payments')
export class PaymentController {
  constructor(
    @InjectTemporalClient() private readonly temporalClient: WorkflowClient,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async postPayment(@Body() data: IStorePaymentDto): Promise<{
    status: number;
    paymentId: string;
  }> {
    const id: string = (Math.random() + 1).toString(36).substring(2);
    // Create payment from request
    const payment: IStorePaymentDto = { ...data };
    payment.id = id;

    const handle = this.temporalClient.getHandle('wf-order-id-' + data.orderId);
    const orderStatus = await handle.query('isOrder');

    if (!orderStatus) {
      return {
        status: 422,
        paymentId: payment.id,
      };
    }
    try {
      await handle.signal('payment', payment);
      await handle.signal('exit');
      await handle.result();
    } catch (err) {
      if (err instanceof WorkflowFailedError) {
        console.log('ERROR OrderWorkflows');
      }
      console.log(`Cancelled orderWorkflow ${handle.workflowId}`);

      throw err;
    }
    console.log(`Completed orderWorkflow ${handle.workflowId}`);

    return {
      status: 200,
      paymentId: payment.id,
    };
  }
}
