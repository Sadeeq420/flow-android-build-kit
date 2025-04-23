
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { formatCurrency } from '@/lib/utils';
import { MonthlySpend } from '@/types';

type TimeUnit = 'daily' | 'weekly' | 'monthly';

interface MonthlySpendChartProps {
  data: MonthlySpend[];
}

export const MonthlySpendChart: React.FC<MonthlySpendChartProps> = ({ data }) => {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('monthly');

  const transformedData = useMemo(() => {
    if (!data) return [];

    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sortedData.map(item => ({
      period: timeUnit === 'daily' ? new Date(item.date).toLocaleDateString() :
             timeUnit === 'weekly' ? `Week ${Math.ceil(new Date(item.date).getDate() / 7)}` :
             new Date(item.date).toLocaleString('default', { month: 'short' }),
      paid: item.paidAmount || 0,
      unpaid: item.amount - (item.paidAmount || 0),
      total: item.amount
    }));
  }, [data, timeUnit]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Spend Analysis</CardTitle>
            <CardDescription>Procurement spend by {timeUnit} period</CardDescription>
          </div>
          <ToggleGroup type="single" value={timeUnit} onValueChange={(value: TimeUnit) => value && setTimeUnit(value)}>
            <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
            <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={transformedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip 
                formatter={(value, name) => [formatCurrency(value as number), name === 'paid' ? 'Paid Amount' : 'Unpaid Amount']}
              />
              <Bar dataKey="paid" fill="#4ade80" name="Paid" stackId="stack" />
              <Bar dataKey="unpaid" fill="#f87171" name="Unpaid" stackId="stack" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
