
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Report } from '@/types';

interface ReportTableProps {
  reports: Report[];
}

export const ReportTable: React.FC<ReportTableProps> = ({ reports }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Report History</CardTitle>
        <CardDescription>History of sent procurement reports</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date Sent</TableHead>
              <TableHead>Recipients</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.dateSent}</TableCell>
                  <TableCell>{report.recipients.join(', ')}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No reports have been sent
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
