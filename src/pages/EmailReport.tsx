
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Check, Mail, Calendar, Clock, Download } from "lucide-react";
import { toast } from "sonner";

const EmailReport = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [emailFormData, setEmailFormData] = useState({
    recipients: "",
    subject: "Procurement Report",
    reportType: "monthly",
    message: "Please find attached the latest procurement report.",
  });
  
  const [reminderFormData, setReminderFormData] = useState({
    title: "",
    date: "",
    time: "",
    notes: "",
  });

  // UI states
  const [activeSection, setActiveSection] = useState<"email" | "reminder">("email");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successAction, setSuccessAction] = useState<"email" | "reminder">("email");

  // Handle email form submission
  const handleSendEmail = () => {
    // In a real app, this would send an email via backend API
    setSuccessMessage("Your report has been sent successfully.");
    setSuccessAction("email");
    setSuccessDialogOpen(true);
  };

  // Handle PDF download
  const handleDownloadPdf = () => {
    // Mock PDF generation and download
    const reportData = {
      type: emailFormData.reportType,
      generatedAt: new Date().toISOString(),
      content: "Procurement Report Content"
    };
    
    // Create a blob with PDF-like content (in real app, this would be actual PDF)
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `procurement-report-${emailFormData.reportType}-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Report downloaded successfully!");
  };

  // Handle reminder form submission
  const handleSaveReminder = () => {
    // In a real app, this would save the reminder to a database
    setSuccessMessage("Your reminder has been saved successfully.");
    setSuccessAction("reminder");
    setSuccessDialogOpen(true);
  };

  // Update form values
  const updateEmailForm = (field: string, value: string) => {
    setEmailFormData({
      ...emailFormData,
      [field]: value,
    });
  };

  const updateReminderForm = (field: string, value: string) => {
    setReminderFormData({
      ...reminderFormData,
      [field]: value,
    });
  };
  
  // Handle success dialog close
  const handleDialogClose = () => {
    setSuccessDialogOpen(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} onLogout={logout} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Report & Reminder Manager</h1>
          <p className="text-gray-600 mt-2">Send reports or schedule reminders</p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-5 py-2.5 text-sm font-medium rounded-l-lg ${
                activeSection === "email"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => setActiveSection("email")}
            >
              <Mail className="inline-block w-4 h-4 mr-2" />
              Send Report Email
            </button>
            <button
              type="button"
              className={`px-5 py-2.5 text-sm font-medium rounded-r-lg ${
                activeSection === "reminder"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => setActiveSection("reminder")}
            >
              <Calendar className="inline-block w-4 h-4 mr-2" />
              Set Reminder
            </button>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {activeSection === "email" ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Send Report Email
                </CardTitle>
                <CardDescription>
                  Send procurement reports via email to stakeholders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipients">Recipients</Label>
                  <Input
                    id="recipients"
                    placeholder="email1@example.com, email2@example.com"
                    value={emailFormData.recipients}
                    onChange={(e) => updateEmailForm("recipients", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple email addresses with commas
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={emailFormData.subject}
                    onChange={(e) => updateEmailForm("subject", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select
                    value={emailFormData.reportType}
                    onValueChange={(value) => updateEmailForm("reportType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Summary</SelectItem>
                      <SelectItem value="weekly">Weekly Report</SelectItem>
                      <SelectItem value="monthly">Monthly Report</SelectItem>
                      <SelectItem value="quarterly">Quarterly Review</SelectItem>
                      <SelectItem value="custom">Custom Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    className="min-h-[150px]"
                    value={emailFormData.message}
                    onChange={(e) => updateEmailForm("message", e.target.value)}
                  />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Report Content</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                      <span>LPO Status Summary</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                      <span>Monthly Spend Analysis</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                      <span>Top Vendor Report</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                      <span>Upcoming Reminders</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                      <span>Email Report History</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button onClick={handleSendEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Report Now
                </Button>
                <Button variant="outline" onClick={handleDownloadPdf}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Set Reminder
                </CardTitle>
                <CardDescription>
                  Create reminders for procurement-related tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Reminder Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Vendor Contract Review"
                    value={reminderFormData.title}
                    onChange={(e) => updateReminderForm("title", e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                      <Input
                        id="date"
                        type="date"
                        className="pl-10"
                        value={reminderFormData.date}
                        onChange={(e) => updateReminderForm("date", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                      <Input
                        id="time"
                        type="time"
                        className="pl-10"
                        value={reminderFormData.time}
                        onChange={(e) => updateReminderForm("time", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional notes or instructions..."
                    className="min-h-[150px]"
                    value={reminderFormData.notes}
                    onChange={(e) => updateReminderForm("notes", e.target.value)}
                  />
                </div>
                
                <Separator />
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Reminder Actions</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                      <span>Send notification via email</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                      <span>Display on dashboard</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                      <span>Save to calendar</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveReminder} 
                  disabled={!reminderFormData.title || !reminderFormData.date || !reminderFormData.time}
                >
                  Save Reminder
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      
      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Check className="h-6 w-6 text-green-500" />
              Success
            </AlertDialogTitle>
            <AlertDialogDescription>
              {successMessage}
              
              {successAction === "email" && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <p><span className="font-medium">Recipients:</span> {emailFormData.recipients || "No recipients specified"}</p>
                  <p><span className="font-medium">Subject:</span> {emailFormData.subject}</p>
                  <p><span className="font-medium">Report Type:</span> {emailFormData.reportType.charAt(0).toUpperCase() + emailFormData.reportType.slice(1)}</p>
                  <p><span className="font-medium">Date Sent:</span> {new Date().toLocaleString()}</p>
                </div>
              )}
              
              {successAction === "reminder" && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <p><span className="font-medium">Title:</span> {reminderFormData.title}</p>
                  <p><span className="font-medium">Date:</span> {reminderFormData.date}</p>
                  <p><span className="font-medium">Time:</span> {reminderFormData.time}</p>
                  {reminderFormData.notes && (
                    <p><span className="font-medium">Notes:</span> {reminderFormData.notes}</p>
                  )}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDialogClose}>
              Go to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmailReport;
