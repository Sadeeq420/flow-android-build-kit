
// User and Auth Types
export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// LPO Types
export type PaymentStatus = 'Paid' | 'Unpaid';

export type LpoStatus = 'Pending' | 'Approved' | 'Rejected';

export type LpoItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
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

export type LpoPayment = {
  id: string;
  amount: number;
  date: string;
  reference: string;
};

// Vendor Type
export type Vendor = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

// Dashboard Types
export type MonthlySpend = {
  month: string;
  amount: number;
};

export type VendorSpend = {
  vendorId: string;
  vendorName: string;
  totalSpend: number;
};

export type DashboardData = {
  lpoStatusSummary: {
    pending: number;
    approved: number;
    rejected: number;
  };
  paymentSummary: {
    paid: number;
    unpaid: number;
    partial: number;
    totalAmount: number;
    paidAmount: number;
  };
  monthlySpend: MonthlySpend[];
  topVendors: VendorSpend[];
  upcomingReminders: Reminder[];
  emailReportHistory: Report[];
  paymentStatusSummary: {
    paid: number;
    unpaid: number;
    totalPaid: number;
    totalUnpaid: number;
  };
};

// Reminder Type
export type Reminder = {
  id: string;
  title: string;
  date: string;
  time: string;
  notes?: string;
};

// Report Type
export type Report = {
  id: string;
  title: string;
  type: string;
  dateSent: string;
  recipients: string[];
};
