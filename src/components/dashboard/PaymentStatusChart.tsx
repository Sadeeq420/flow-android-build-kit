
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils';

const COLORS = {
  "Paid": "#00C49F",
  "Yet To Be Paid": "#FFBB28",
  "Unpaid": "#FF8042"
};

interface PaymentStatusChartProps {
  data: { name: string; value: number }[];
}

export const PaymentStatusChart: React.FC<PaymentStatusChartProps> = ({ data }) => {
  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // If there's no data or just zeros, display a message
  const hasData = data.length > 0 && total > 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Payment Status</CardTitle>
        <CardDescription>Distribution of paid vs unpaid LPOs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          {hasData ? (
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => {
                    // Format currency for labels and show percentage
                    const amount = formatCurrency(value);
                    const percent = total > 0 ? Math.round((value / total) * 100) : 0;
                    return `${name}: ${percent}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name as keyof typeof COLORS] || "#8884d8"} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value as number)}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No payment data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
