import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { WorkflowClient, WorkflowFailedError } from '@temporalio/client';
import { InjectTemporalClient } from 'nestjs-temporal';
import { nanoid } from 'nanoid';

import { CreatePaymentReqDto } from './dtos/CreatePaymentReqDto';

@Controller('/payments')
export class PaymentController {
  constructor(
    @InjectTemporalClient() private readonly temporalClient: WorkflowClient,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async postPayment(@Body() data: CreatePaymentReqDto): Promise<{
    status: number;
    paymentId: string;
  }> {
    const payment: CreatePaymentReqDto = { ...data };
    payment.id = nanoid();

    const handle = this.temporalClient.getHandle(data.orderId);
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
