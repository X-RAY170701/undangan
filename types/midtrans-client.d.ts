declare module "midtrans-client" {
  interface SnapConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  interface ItemDetail {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }

  interface CreateTransactionParams {
    transaction_details: TransactionDetails;
    customer_details?: { email?: string | null; [key: string]: unknown };
    item_details?: ItemDetail[];
  }

  interface TransactionResult {
    token: string;
    redirect_url: string;
  }

  interface SnapInstance {
    createTransaction(params: CreateTransactionParams): Promise<TransactionResult>;
  }

  interface MidtransClient {
    Snap: new (config: SnapConfig) => SnapInstance;
  }

  const midtransClient: MidtransClient;
  export default midtransClient;
}
