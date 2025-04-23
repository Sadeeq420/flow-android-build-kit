
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { lpoService } from "@/services/lpoService";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { LpoStatusChart } from "@/components/dashboard/LpoStatusChart";
import { PaymentStatusChart } from "@/components/dashboard/PaymentStatusChart";
import { MonthlySpendChart } from "@/components/dashboard/MonthlySpendChart";
import { LpoTable } from "@/components/dashboard/LpoTable";
import { EmailReportDialog } from "@/components/dashboard/EmailReportDialog";
import Header from "@/components/Header";
import { Lpo, Reminder, Report, PaymentStatus } from "@/types";
import { reminderService } from "@/services/reminderService";
import { reportService } from "@/services/reportService";
import { ReminderTable } from "@/components/dashboard/ReminderTable";
import { ReportTable } from "@/components/dashboard/ReportTable";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { dashboardData, loading } = useDashboardData();
  
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({
    recipients: "",
    subject: "Procurement Dashboard Report",
    message: "Please find attached the latest procurement dashboard report.",
  });

  const [lpos, setLpos] = useState<Lpo[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lposData, remindersData, reportsData] = await Promise.all([
          lpoService.getLpos(),
          reminderService.getReminders(),
          reportService.getReports(),
        ]);

        setLpos(lposData);
        setReminders(remindersData);
        setReports(reportsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      }
    };

    fetchData();
  }, []);

  const handleEmailFormChange = (field: string, value: string) => {
    setEmailForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSendEmail = () => {
    setEmailDialogOpen(false);
    toast.success("Email sent successfully!");
  };

  const handleStatusChange = async (lpoId: string, newStatus: string) => {
    try {
      await lpoService.updateLpoStatus(lpoId, newStatus);
      setLpos(lpos.map(lpo => 
        lpo.id === lpoId ? { ...lpo, status: newStatus } : lpo
      ));
      toast.success('LPO status updated successfully');
    } catch (error) {
      console.error('Error updating LPO status:', error);
      toast.error('Failed to update LPO status');
    }
  };

  const handlePaymentStatusChange = async (lpoId: string, newStatus: string) => {
    try {
      const typedStatus = newStatus as PaymentStatus;
      await lpoService.updatePaymentStatus(lpoId, typedStatus);
      setLpos(lpos.map(lpo => 
        lpo.id === lpoId ? { ...lpo, paymentStatus: typedStatus } : lpo
      ));
      toast.success('LPO payment status updated successfully');
    } catch (error) {
      console.error('Error updating LPO payment status:', error);
      toast.error('Failed to update LPO payment status');
    }
  };

  const handleDeleteLpo = async (lpoId: string) => {
    try {
      await lpoService.deleteLpo(lpoId);
      setLpos(lpos.filter(lpo => lpo.id !== lpoId));
      toast.success('LPO deleted successfully');
    } catch (error) {
      console.error('Error deleting LPO:', error);
      toast.error('Failed to delete LPO');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header user={user} onLogout={logout} />
        <div className="flex items-center justify-center h-full">
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const lpoStatusData = [
    { name: "Pending", value: dashboardData?.lpoStatusSummary.pending || 0 },
    { name: "Approved", value: dashboardData?.lpoStatusSummary.approved || 0 },
    { name: "Rejected", value: dashboardData?.lpoStatusSummary.rejected || 0 },
  ];

  // Use financial values (amounts) for payment status data instead of counts
  const paymentStatusData = [
    { name: "Paid", value: dashboardData?.paymentStatusSummary.totalPaid || 0 },
    { name: "Yet To Be Paid", value: dashboardData?.paymentStatusSummary.totalUnpaid || 0 }
  ];

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
            <EmailReportDialog
              open={emailDialogOpen}
              onOpenChange={setEmailDialogOpen}
              emailForm={emailForm}
              onEmailFormChange={handleEmailFormChange}
              onSendEmail={handleSendEmail}
            />
            <Button onClick={() => navigate("/email-report")}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <LpoStatusChart data={lpoStatusData} />
          <PaymentStatusChart data={paymentStatusData} />
          <MonthlySpendChart data={dashboardData?.monthlySpend || []} />
        </div>
        
        <Tabs defaultValue="lpos">
          <TabsList className="mb-4">
            <TabsTrigger value="lpos">LPOs</TabsTrigger>
            <TabsTrigger value="reminders">Upcoming Reminders</TabsTrigger>
            <TabsTrigger value="reports">Email Report History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lpos" className="space-y-4">
            <LpoTable
              lpos={lpos}
              onStatusChange={handleStatusChange}
              onPaymentStatusChange={handlePaymentStatusChange}
              onDelete={handleDeleteLpo}
            />
          </TabsContent>
          
          <TabsContent value="reminders" className="space-y-4">
            <ReminderTable reminders={reminders} />
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <ReportTable reports={reports} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
