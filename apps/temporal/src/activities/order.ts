import { IOrder } from "../types";

export interface OrderActivityInterface {
  order(payload: IOrder): Promise<boolean>;
  revertOrder(payload: IOrder): Promise<void>;
  notifyOrder(payload: IOrder): Promise<void>;
  revertNotifyOrder(payload: IOrder): Promise<void>;
}
