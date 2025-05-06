
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash, FileText } from 'lucide-react';
import { Lpo } from '@/types';
import LpoStatusSelect from '@/components/LpoStatusSelect';
import PaymentStatusSelect from '@/components/PaymentStatusSelect';
import { pdfService } from '@/services/pdfService';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

interface LpoTableProps {
  lpos: Lpo[];
  onStatusChange: (lpoId: string, newStatus: string) => void;
  onPaymentStatusChange: (lpoId: string, newStatus: string) => void;
  onDelete: (lpoId: string) => void;
}

export const LpoTable: React.FC<LpoTableProps> = ({
  lpos,
  onStatusChange,
  onPaymentStatusChange,
  onDelete,
}) => {
  const handleExportToPdf = async (lpo: Lpo) => {
    try {
      const result = await pdfService.exportLpoToDrive(lpo, "Sadiq@qumecs.com");
      if (result) {
        toast.success(`LPO exported to Google Drive (Sadiq@qumecs.com)`);
      }
    } catch (error) {
      toast.error("Failed to export LPO to PDF");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = parseISO(dateString);
      return format(date, 'dd/MM/yyyy HH:mm');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
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
            {lpos.map((lpo) => (
              <TableRow key={lpo.id}>
                <TableCell className="font-medium">{lpo.lpoNumber || lpo.id}</TableCell>
                <TableCell>{lpo.vendorName}</TableCell>
                <TableCell>{formatDate(lpo.dateCreated)}</TableCell>
                <TableCell>{formatCurrency(lpo.totalAmount)}</TableCell>
                <TableCell>
                  <LpoStatusSelect 
                    status={lpo.status}
                    onStatusChange={(newStatus) => onStatusChange(lpo.id, newStatus)}
                  />
                </TableCell>
                <TableCell>
                  <PaymentStatusSelect
                    status={lpo.paymentStatus}
                    onStatusChange={(newStatus) => onPaymentStatusChange(lpo.id, newStatus)}
                  />
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleExportToPdf(lpo)}
                    title="Export to Google Drive"
                    className="text-primary hover:text-primary/90"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(lpo.id)}
                    title="Delete LPO" 
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
  );
};
