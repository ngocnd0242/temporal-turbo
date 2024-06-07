export interface ITransfer {
  amount: number;
  fromUser: string;
  toUser: string;
  referenceID: string;
}

export interface IStoreOrderDto {
  id: string;
  productId: number;
  price: number;
}

export interface IStorePaymentDto {
  id: string;
  orderId: string;
  name: number;
  failed: boolean;
}
