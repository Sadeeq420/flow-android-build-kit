
// Define types for the application

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type Vendor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type LpoStatus = 'Pending' | 'Approved' | 'Rejected';

export type PaymentStatus = 'Unpaid' | 'Partially Paid' | 'Fully Paid';

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
  status: LpoStatus;
  items: LpoItem[];
  totalAmount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
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
};
