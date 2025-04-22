
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash } from 'lucide-react';
import { Lpo } from '@/types';
import LpoStatusSelect from '@/components/LpoStatusSelect';
import PaymentStatusSelect from '@/components/PaymentStatusSelect';

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
                <TableCell className="font-medium">{lpo.id}</TableCell>
                <TableCell>{lpo.vendorName}</TableCell>
                <TableCell>{lpo.dateCreated}</TableCell>
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
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(lpo.id)}
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
