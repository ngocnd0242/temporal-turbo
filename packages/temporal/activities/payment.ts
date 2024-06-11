import { IPayment } from "../types";

export interface IPaymentActivity {
  payment(payload: IPayment): Promise<void>;
  revertPayment(payload: IPayment): Promise<void>;
  notifyPayment(payload: IPayment): Promise<void>;
  revertNotifyPayment(payload: IPayment): Promise<void>;
}
