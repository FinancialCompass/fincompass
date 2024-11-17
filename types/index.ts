export interface Bank {
  id: string;
  userId: string;
  institutionId: string;
  institutionName: string;
  accessToken: string;
  itemId: string;
  lastSyncDate: string;
}


export interface Account {
  account_id: string;
  name: string;
  type: string;
  subtype: string;
  balances: {
    current: number;
  };
}

export interface Transaction {
  transaction_id: string;
  date: string;
  amount: number;
  name: string;
  merchant_name?: string;
  personal_finance_category?: {
    primary: string;
  };
}