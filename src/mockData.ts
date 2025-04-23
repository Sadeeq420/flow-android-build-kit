
import { User, Vendor, Lpo, Report, Reminder, DashboardData, PaymentStatus } from "./types";

// Mock Users
export const mockUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@qumecs.com", role: "Manager" },
  { id: "2", name: "Jane Smith", email: "jane@qumecs.com", role: "Procurement Officer" },
  { id: "3", name: "Mike Johnson", email: "mike@qumecs.com", role: "Finance" },
  { id: "4", name: "Sadiq", email: "sadiq@qumecs.com", role: "User" }
];

// Mock Vendors - Now as a function to allow adding new vendors
let vendorsList: Vendor[] = [
  { id: "v1", name: "Tech Supplies Ltd.", email: "info@techsupplies.com", phone: "123-456-7890", address: "123 Tech St, City" },
  { id: "v2", name: "Office Solutions Inc.", email: "sales@officesolutions.com", phone: "234-567-8901", address: "456 Office Ave, Town" },
  { id: "v3", name: "Global Services Co.", email: "contact@globalservices.com", phone: "345-678-9012", address: "789 Global Rd, County" },
  { id: "v4", name: "Hardware Depot", email: "support@hardwaredepot.com", phone: "456-789-0123", address: "101 Hardware Blvd, State" },
  { id: "v5", name: "Software Systems", email: "info@softwaresystems.com", phone: "567-890-1234", address: "202 Software Ln, Country" },
];

// Functions to manipulate vendor data
export const mockVendors = vendorsList;

export const addVendor = (vendor: Omit<Vendor, "id">): Vendor => {
  const newVendor: Vendor = {
    ...vendor,
    id: `v${vendorsList.length + 1}`,
  };
  
  vendorsList.push(newVendor);
  return newVendor;
};

// Mock LPOs with payment information
export const mockLpos: Lpo[] = [
  {
    id: "lpo1",
    vendorId: "v1",
    vendorName: "Tech Supplies Ltd.",
    dateCreated: "2024-04-10",
    status: "Approved",
    paymentStatus: "Paid", 
    items: [
      { id: "i1", description: "Laptop Computers", quantity: 5, unitPrice: 1200, totalPrice: 6000 },
      { id: "i2", description: "Monitors", quantity: 10, unitPrice: 250, totalPrice: 2500 }
    ],
    totalAmount: 8500,
    paidAmount: 8500,
    payments: [
      { id: "p1", amount: 8500, date: "2024-04-15", reference: "PAY001" }
    ],
    createdBy: "2"
  },
  {
    id: "lpo2",
    vendorId: "v2",
    vendorName: "Office Solutions Inc.",
    dateCreated: "2024-04-12",
    status: "Pending",
    paymentStatus: "Unpaid", 
    items: [
      { id: "i3", description: "Office Chairs", quantity: 20, unitPrice: 150, totalPrice: 3000 },
      { id: "i4", description: "Filing Cabinets", quantity: 5, unitPrice: 200, totalPrice: 1000 }
    ],
    totalAmount: 4000,
    paidAmount: 0,
    payments: [],
    createdBy: "1"
  }
];

// Mock Reports
export const mockReports: Report[] = [
  { id: "r1", title: "Monthly Procurement Summary", type: "Monthly", dateSent: "2024-03-31", recipients: ["john@qumecs.com", "mike@qumecs.com"] },
  { id: "r2", title: "Vendor Performance Review", type: "Quarterly", dateSent: "2024-03-31", recipients: ["john@qumecs.com"] },
  { id: "r3", title: "Budget Utilization Report", type: "Monthly", dateSent: "2024-02-29", recipients: ["jane@qumecs.com", "mike@qumecs.com"] }
];

// Mock Reminders
export const mockReminders: Reminder[] = [
  { id: "rem1", title: "Vendor Contract Renewal", date: "2024-04-30", time: "09:00" },
  { id: "rem2", title: "Quarterly Budget Review", date: "2024-05-15", time: "14:00", notes: "Prepare procurement expenditure summary" },
  { id: "rem3", title: "Inventory Check", date: "2024-05-01", time: "10:00" }
];

// Dashboard Data with payment information - removed duplicate declaration
export const mockDashboardData: DashboardData = {
  lpoStatusSummary: {
    pending: 2,
    approved: 1,
    rejected: 1
  },
  paymentSummary: {
    paid: 1,
    unpaid: 2,
    partial: 1,
    totalAmount: 19600,
    paidAmount: 8475
  },
  monthlySpend: [
    { month: "Jan", amount: 12500 },
    { month: "Feb", amount: 9800 },
    { month: "Mar", amount: 15200 },
    { month: "Apr", amount: 19600 }
  ],
  topVendors: [
    { vendorId: "v1", vendorName: "Tech Supplies Ltd.", totalSpend: 22500 },
    { vendorId: "v2", vendorName: "Office Solutions Inc.", totalSpend: 15800 },
    { vendorId: "v3", vendorName: "Global Services Co.", totalSpend: 12000 },
    { vendorId: "v4", vendorName: "Hardware Depot", totalSpend: 8500 },
    { vendorId: "v5", vendorName: "Software Systems", totalSpend: 6200 }
  ],
  upcomingReminders: mockReminders,
  emailReportHistory: mockReports,
  paymentStatusSummary: {
    paid: mockLpos.filter(lpo => lpo.paymentStatus === "Paid").length,
    unpaid: mockLpos.filter(lpo => lpo.paymentStatus === "Unpaid").length,
    totalPaid: mockLpos.reduce((sum, lpo) => sum + (lpo.paymentStatus === "Paid" ? lpo.totalAmount : 0), 0),
    totalUnpaid: mockLpos.reduce((sum, lpo) => sum + (lpo.paymentStatus === "Unpaid" ? lpo.totalAmount : 0), 0)
  }
};

// Function to simulate authentication
export const authenticateUser = (email: string, password: string): User | null => {
  if (
    (email === "jane@qumecs.com" && password === "password123") ||
    (email === "sadiq@qumecs.com" && password === "Sadiq123")
  ) {
    return mockUsers.find(user => user.email === email) || null;
  }
  return null;
};
