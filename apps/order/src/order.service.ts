import { Injectable } from '@nestjs/common';
import { IOrder } from './shared/types';

@Injectable()
export class OrderService {
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
