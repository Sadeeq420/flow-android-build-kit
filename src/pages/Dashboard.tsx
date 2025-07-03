
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
      console.log('Attempting to delete LPO:', lpoId);
      await lpoService.deleteLpo(lpoId);
      setLpos(prevLpos => prevLpos.filter(lpo => lpo.id !== lpoId));
      toast.success('LPO deleted successfully');
    } catch (error) {
      console.error('Error deleting LPO:', error);
      toast.error('Failed to delete LPO. Please try again.');
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

  const paymentStatusData = [
    { name: "Paid", value: dashboardData?.paymentStatusSummary.totalPaid || 0 },
    { name: "Unpaid", value: dashboardData?.paymentStatusSummary.totalUnpaid || 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-muted to-background-subtle flex flex-col">
      <Header user={user} onLogout={logout} />
      
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 animate-in">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Procurement Dashboard</h1>
            <p className="text-foreground-muted text-lg">Real-time overview of your procurement activities</p>
          </div>
          <div className="flex gap-3">
            <EmailReportDialog
              open={emailDialogOpen}
              onOpenChange={setEmailDialogOpen}
              emailForm={emailForm}
              onEmailFormChange={handleEmailFormChange}
              onSendEmail={handleSendEmail}
            />
            <Button 
              onClick={() => navigate("/email-report")}
              className="silky-button bg-gradient-to-r from-accent to-accent-hover text-accent-foreground"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="animate-in" style={{ animationDelay: '100ms' }}>
            <LpoStatusChart data={lpoStatusData} />
          </div>
          <div className="animate-in" style={{ animationDelay: '200ms' }}>
            <PaymentStatusChart data={paymentStatusData} />
          </div>
          <div className="animate-in" style={{ animationDelay: '300ms' }}>
            <MonthlySpendChart data={dashboardData?.monthlySpend || []} />
          </div>
        </div>
        
        <Tabs defaultValue="lpos" className="animate-in" style={{ animationDelay: '400ms' }}>
          <TabsList className="mb-6 bg-card border border-card-border shadow-sm">
            <TabsTrigger value="lpos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">LPOs</TabsTrigger>
            <TabsTrigger value="reminders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Upcoming Reminders</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Email Report History</TabsTrigger>
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
