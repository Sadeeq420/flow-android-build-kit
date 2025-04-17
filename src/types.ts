
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
  status: LpoStatus;
  items: LpoItem[];
  totalAmount: number;
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
  monthlySpend: MonthlySpend[];
  topVendors: VendorSpend[];
  upcomingReminders: Reminder[];
  emailReportHistory: Report[];
};
