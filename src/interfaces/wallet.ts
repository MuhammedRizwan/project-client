export default interface Wallet {
  _id: string;
  user_id: string;
  walletBalance: number;
  transaction: Transaction[];
}

export interface Transaction {
  _id?: string;
  date: string;
  reason?: string;
  amount: number;
  transactionType: "credit" | "debit";
}
