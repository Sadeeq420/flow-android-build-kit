
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { MonthlySpend } from '@/types';

interface MonthlySpendChartProps {
  data: MonthlySpend[];
}

export const MonthlySpendChart: React.FC<MonthlySpendChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-lg">Spend Analysis</CardTitle>
          <CardDescription>Monthly procurement spend</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip 
                formatter={(value, name) => [formatCurrency(value as number), name === 'paid' ? 'Paid Amount' : 'Unpaid Amount']}
              />
              <Bar dataKey="paidAmount" fill="#4ade80" name="Paid" stackId="stack" />
              <Bar dataKey="unpaid" fill="#f87171" name="Unpaid" stackId="stack" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
