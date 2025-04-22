import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardData, MonthlySpend, VendorSpend, Lpo } from '@/types';
import { toast } from 'sonner';

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch monthly spend data
        const { data: monthlyData, error: monthlyError } = await supabase
          .from('lpos')
          .select('date_created, total_amount')
          .order('date_created');

        if (monthlyError) throw monthlyError;

        const monthlySpend: MonthlySpend[] = monthlyData.reduce((acc: MonthlySpend[], curr) => {
          const month = new Date(curr.date_created).toLocaleString('default', { month: 'short' });
          const existingMonth = acc.find(item => item.month === month);
          
          if (existingMonth) {
            existingMonth.amount += Number(curr.total_amount);
          } else {
            acc.push({ month, amount: Number(curr.total_amount) });
          }
          return acc;
        }, []);

        // Fetch vendor spend data
        const { data: vendorData, error: vendorError } = await supabase
          .from('lpos')
          .select(`
            vendor_id,
            vendors (
              name
            ),
            total_amount
          `);

        if (vendorError) throw vendorError;

        const vendorSpend: VendorSpend[] = vendorData.reduce((acc: VendorSpend[], curr) => {
          const vendorId = curr.vendor_id;
          const existingVendor = acc.find(item => item.vendorId === vendorId);
          
          if (existingVendor) {
            existingVendor.totalSpend += Number(curr.total_amount);
          } else {
            acc.push({
              vendorId,
              vendorName: curr.vendors?.name || 'Unknown Vendor',
              totalSpend: Number(curr.total_amount)
            });
          }
          return acc;
        }, []).sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 5);

        // Calculate LPO status summary
        const { data: statusData, error: statusError } = await supabase
          .from('lpos')
          .select('status');

        if (statusError) throw statusError;

        const lpoStatusSummary = statusData.reduce((acc: any, curr) => {
          const status = curr.status.toLowerCase();
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, { pending: 0, approved: 0, rejected: 0 });

        // Calculate payment summary
        const { data: paymentData, error: paymentError } = await supabase
          .from('lpo_payments')
          .select('amount');

        if (paymentError) throw paymentError;

        const totalPaid = paymentData.reduce((sum, curr) => sum + Number(curr.amount), 0);
        const totalAmount = monthlySpend.reduce((sum, curr) => sum + curr.amount, 0);

        setDashboardData({
          lpoStatusSummary,
          paymentSummary: {
            paid: paymentData.length,
            unpaid: statusData.length - paymentData.length,
            totalAmount,
            paidAmount: totalPaid,
            partial: 0, // Add this to match the type
          },
          paymentStatusSummary: {
            paid: paymentData.length,
            unpaid: statusData.length - paymentData.length,
            totalPaid,
            totalUnpaid: totalAmount - totalPaid
          },
          monthlySpend,
          topVendors: vendorSpend,
          upcomingReminders: [],
          emailReportHistory: [],
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { dashboardData, loading };
};
