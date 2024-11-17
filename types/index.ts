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

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface Metadata {
  merchant_name: string;
  merchant_address: Address;
  merchant_phone: string | null;
  date: string;  // YYYY-MM-DD format
  time: string;  // HH:MM format
  receipt_id: string;
  store_hours?: string | null;
  merchant_id?: string;
  terminal_id?: string;
}

interface PaymentMethod {
  type: 'CREDIT' | 'DEBIT' | 'CASH' | 'OTHER';
  entry_method: 'CHIP' | 'SWIPE' | 'TAP' | 'MANUAL' | null;
  card_type?: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER' | null;
  last_digits?: string;
  approval_code?: string;
}

interface Transaction {
  subtotal: number;
  tax: number | null;
  tip: number | null;
  total: number;
  payment_method: PaymentMethod;
  order_id?: string;
  transaction_id?: string;
}

interface ReceiptItem {
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  category:
  | 'PRODUCE'
  | 'GROCERY'
  | 'DESSERT'
  | 'BEVERAGE'
  | 'PREPARED_FOOD'
  | 'OTHER';
  discount?: number;
  weight?: string;
  unit?: string;
  sku?: string;
  tax_rate?: number;
}

export interface Receipt {
  summary: string;  // Unique description of the purchase
  metadata: Metadata;
  transaction: Transaction;
  items: ReceiptItem[];
  status?: 'PROCESSED' | 'PENDING' | 'ERROR';
  tags?: string[];  // Custom tags for organization
  notes?: string;   // Additional user notes
  created_at: string;  // When the receipt was added to system
  updated_at: string;  // Last modification time
}

// Example usage type for multiple receipts
interface ReceiptGroup {
  date: string;
  receipts: Receipt[];
  total_spent: number;
}

// API Response interfaces
interface ReceiptResponse {
  success: boolean;
  data: Receipt;
  error?: string;
}

interface ReceiptListResponse {
  success: boolean;
  data: {
    receipts: Receipt[];
    total_count: number;
    page: number;
    page_size: number;
    total_amount: number;
  };
  error?: string;
}