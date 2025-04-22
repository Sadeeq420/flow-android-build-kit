
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail } from 'lucide-react';

interface EmailReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emailForm: {
    recipients: string;
    subject: string;
    message: string;
  };
  onEmailFormChange: (field: string, value: string) => void;
  onSendEmail: () => void;
}

export const EmailReportDialog: React.FC<EmailReportDialogProps> = ({
  open,
  onOpenChange,
  emailForm,
  onEmailFormChange,
  onSendEmail,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onChange={(e) => onEmailFormChange('recipients', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={emailForm.subject}
              onChange={(e) => onEmailFormChange('subject', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={emailForm.message}
              onChange={(e) => onEmailFormChange('message', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSendEmail}>Send Email</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
