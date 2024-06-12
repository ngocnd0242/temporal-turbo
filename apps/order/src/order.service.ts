import { Injectable } from '@nestjs/common';
import { IOrder } from './types';
import { IOrderActivity } from '@repo/temporal/activities';

@Injectable()
export class OrderService implements IOrderActivity {
  constructor() {}

  async order(order: IOrder): Promise<boolean> {
    const str: string = `[Order] ID ${order.id}, Price +$${order.price}  Success!`;
    console.log(str);

    return true;
  }

  async revertOrder(order: IOrder): Promise<void> {
    const str: string = `[Revert Order] ID ${order.id}, Price -${order.price} Success!`;
    console.log(str);
  }

  async notifyOrder(order: IOrder): Promise<void> {
    const str: string = `[Notification] Order ID ${order.id}, Price +$${order.price}  Success!`;
    console.log(str);
  }

  async revertNotifyOrder(order: IOrder): Promise<void> {
    const str: string = `[Notification Revert] Order ID ${order.id}, Price -$${order.price}  Success!`;
    console.log(str);
  }
}
