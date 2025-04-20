import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import LpoStatusSelect from "@/components/LpoStatusSelect";
import PaymentStatusSelect from "@/components/PaymentStatusSelect";
import { toast } from "sonner";
import { Trash, MessageSquare, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { mockDashboardData, mockLpos } from "@/mockData";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
const STATUS_COLORS = {
  Pending: "#FFBB28",
  Approved: "#00C49F",
  Rejected: "#FF8042"
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({
    recipients: "",
    subject: "Procurement Dashboard Report",
    message: "Please find attached the latest procurement dashboard report.",
  });

  const lpoStatusData = [
    { name: "Pending", value: mockDashboardData.lpoStatusSummary.pending },
    { name: "Approved", value: mockDashboardData.lpoStatusSummary.approved },
    { name: "Rejected", value: mockDashboardData.lpoStatusSummary.rejected },
  ];

  const paymentStatusData = [
    { name: "Paid", value: mockDashboardData.paymentStatusSummary.totalPaid },
    { name: "Yet To Be Paid", value: mockDashboardData.paymentStatusSummary.totalUnpaid }
  ];

  const handleSendEmail = () => {
    setEmailDialogOpen(false);
    alert("Email sent successfully!");
  };

  const handleStatusChange = async (lpoId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('lpos')
        .update({ status: newStatus })
        .eq('id', lpoId);

      if (error) throw error;
      
      const updatedLpos = mockLpos.map(lpo => 
        lpo.id === lpoId ? { ...lpo, status: newStatus } : lpo
      );
      toast.success('LPO status updated successfully');
    } catch (error) {
      console.error('Error updating LPO status:', error);
      toast.error('Failed to update LPO status');
    }
  };

  const handlePaymentStatusChange = async (lpoId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('lpos')
        .update({ paymentStatus: newStatus })
        .eq('id', lpoId);

      if (error) throw error;
      
      const updatedLpos = mockLpos.map(lpo => 
        lpo.id === lpoId ? { ...lpo, paymentStatus: newStatus } : lpo
      );
      toast.success('LPO payment status updated successfully');
    } catch (error) {
      console.error('Error updating LPO payment status:', error);
      toast.error('Failed to update LPO payment status');
    }
  };

  const handleDeleteLpo = async (lpoId: string) => {
    try {
      const { error } = await supabase
        .from('lpos')
        .delete()
        .eq('id', lpoId);

      if (error) throw error;
      
      const updatedLpos = mockLpos.filter(lpo => lpo.id !== lpoId);
      toast.success('LPO deleted successfully');
    } catch (error) {
      console.error('Error deleting LPO:', error);
      toast.error('Failed to delete LPO');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} onLogout={logout} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Procurement Dashboard</h1>
            <p className="text-gray-600">Overview of procurement activities</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" /> 
                  Send Report
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Dashboard Report</DialogTitle>
                  <DialogDescription>
                    Send the current dashboard as a report via email.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipients">Recipients</Label>
                    <Input
                      id="recipients"
                      placeholder="email@example.com"
                      value={emailForm.recipients}
                      onChange={(e) => setEmailForm({...emailForm, recipients: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={emailForm.message}
                      onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendEmail}>
                    Send Email
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button onClick={() => navigate("/email-report")}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">LPO Status</CardTitle>
              <CardDescription>Distribution of LPO statuses</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={lpoStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {lpoStatusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Payment Status</CardTitle>
              <CardDescription>Distribution of paid vs unpaid LPOs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Monthly Spend</CardTitle>
              <CardDescription>Procurement spend by month</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockDashboardData.monthlySpend}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value)} 
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), 'Amount']} 
                    />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="lpos">
          <TabsList className="mb-4">
            <TabsTrigger value="lpos">LPOs</TabsTrigger>
            <TabsTrigger value="reminders">Upcoming Reminders</TabsTrigger>
            <TabsTrigger value="reports">Email Report History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lpos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent LPOs</CardTitle>
                <CardDescription>List of recent purchase orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>LPO ID</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLpos.map((lpo) => (
                      <TableRow key={lpo.id}>
                        <TableCell className="font-medium">{lpo.id}</TableCell>
                        <TableCell>{lpo.vendorName}</TableCell>
                        <TableCell>{lpo.dateCreated}</TableCell>
                        <TableCell>{formatCurrency(lpo.totalAmount)}</TableCell>
                        <TableCell>
                          <LpoStatusSelect 
                            status={lpo.status}
                            onStatusChange={(newStatus) => handleStatusChange(lpo.id, newStatus)}
                          />
                        </TableCell>
                        <TableCell>
                          <PaymentStatusSelect
                            status={lpo.paymentStatus}
                            onStatusChange={(newStatus) => handlePaymentStatusChange(lpo.id, newStatus)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteLpo(lpo.id)}
                            className="text-destructive hover:text-destructive/90"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reminders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Reminders</CardTitle>
                <CardDescription>Scheduled reminders and events</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDashboardData.upcomingReminders.map((reminder) => (
                      <TableRow key={reminder.id}>
                        <TableCell className="font-medium">{reminder.title}</TableCell>
                        <TableCell>{reminder.date}</TableCell>
                        <TableCell>{reminder.time}</TableCell>
                        <TableCell>{reminder.notes || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={() => navigate("/email-report")}>
                    Add Reminder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Report History</CardTitle>
                <CardDescription>Previously sent report emails</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date Sent</TableHead>
                      <TableHead>Recipients</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDashboardData.emailReportHistory.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.title}</TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.dateSent}</TableCell>
                        <TableCell>
                          {report.recipients.length > 1 
                            ? `${report.recipients[0]} +${report.recipients.length - 1}` 
                            : report.recipients[0]}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
