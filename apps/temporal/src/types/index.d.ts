export interface IOrder {
    id: string;
    productId: number;
    price: number;
}
export interface IPayment {
    id: string;
    orderId: number;
    price: number;
    failed: boolean;
}
export interface ICompensation {
    message: string;
    fn: () => Promise<void>;
}
//# sourceMappingURL=index.d.ts.map