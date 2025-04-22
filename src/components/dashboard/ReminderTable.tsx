
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Reminder } from '@/types';

interface ReminderTableProps {
  reminders: Reminder[];
}

export const ReminderTable: React.FC<ReminderTableProps> = ({ reminders }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Reminders</CardTitle>
        <CardDescription>Scheduled reminders for procurement activities</CardDescription>
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
            {reminders.length > 0 ? (
              reminders.map((reminder) => (
                <TableRow key={reminder.id}>
                  <TableCell className="font-medium">{reminder.title}</TableCell>
                  <TableCell>{reminder.date}</TableCell>
                  <TableCell>{reminder.time}</TableCell>
                  <TableCell>{reminder.notes || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No reminders scheduled
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
