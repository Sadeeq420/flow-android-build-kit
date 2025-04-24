
export type Vendor = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type LpoStatus = "Pending" | "Approved" | "Rejected";
export type PaymentStatus = "Paid" | "Unpaid" | "Partial";

export type LpoItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type LpoPayment = {
  id: string;
  amount: number;
  date: string;
  reference: string;
};

export type Lpo = {
  id: string;
  vendorId: string;
  vendorName: string;
  dateCreated: string;
  status: string;
  paymentStatus: PaymentStatus;
  items: LpoItem[];
  totalAmount: number;
  paidAmount: number;
  payments: LpoPayment[];
  createdBy: string;
};

export type Report = {
  id: string;
  title: string;
  type: string;
  dateSent: string;
  recipients: string[];
};

export type Reminder = {
  id: string;
  title: string;
  date: string;
  time: string;
  notes?: string;
};

export type MonthlySpend = {
  month: string;
  amount: number;
  date: string;
  paidAmount: number;
  unpaid?: number;
};

export type VendorSpend = {
  vendorId: string;
  vendorName: string;
  totalSpend: number;
};

export type LpoStatusSummary = {
  pending: number;
  approved: number;
  rejected: number;
};

export type PaymentSummary = {
  paid: number;
  unpaid: number;
  partial: number;
  totalAmount: number;
  paidAmount: number;
};

export type PaymentStatusSummary = {
  paid: number;
  unpaid: number;
  totalPaid: number;
  totalUnpaid: number;
};

export type DashboardData = {
  lpoStatusSummary: LpoStatusSummary;
  paymentSummary: PaymentSummary;
  paymentStatusSummary: PaymentStatusSummary;
  monthlySpend: MonthlySpend[];
  topVendors: VendorSpend[];
  upcomingReminders: Reminder[];
  emailReportHistory: Report[];
};
