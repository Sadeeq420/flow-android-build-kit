
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardData, MonthlySpend, VendorSpend, PaymentStatus } from '@/types';
import { toast } from 'sonner';

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Use a single transaction for all dashboard data to improve performance
        const { data: lposData, error: lposError } = await supabase
          .from('lpos')
          .select(`
            id,
            status,
            date_created,
            total_amount,
            payment_status,
            vendor:vendors(id, name)
          `);

        if (lposError) throw lposError;

        // Calculate monthly spend from the lpos data
        const monthlySpend: MonthlySpend[] = lposData.reduce((acc: MonthlySpend[], curr) => {
          const month = new Date(curr.date_created).toLocaleString('default', { month: 'short' });
          const existingMonth = acc.find(item => item.month === month);
          
          if (existingMonth) {
            existingMonth.amount += Number(curr.total_amount);
          } else {
            acc.push({ month, amount: Number(curr.total_amount) });
          }
          return acc;
        }, []);

        // Calculate vendor spend data
        const vendorSpend: VendorSpend[] = lposData.reduce((acc: VendorSpend[], curr) => {
          const vendorId = curr.vendor_id;
          const existingVendor = acc.find(item => item.vendorId === vendorId);
          
          if (existingVendor) {
            existingVendor.totalSpend += Number(curr.total_amount);
          } else if (curr.vendor) {
            acc.push({
              vendorId: curr.vendor_id,
              vendorName: curr.vendor?.name || 'Unknown Vendor',
              totalSpend: Number(curr.total_amount)
            });
          }
          return acc;
        }, []).sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 5);

        // Calculate LPO status summary
        const lpoStatusSummary = lposData.reduce((acc: any, curr) => {
          const status = curr.status.toLowerCase();
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, { pending: 0, approved: 0, rejected: 0 });

        // Calculate payment status summary - fixed to use the correct property
        const paymentStatusSummary = lposData.reduce(
          (acc, curr) => {
            const status = (curr.payment_status || 'Unpaid') as PaymentStatus;
            
            if (status === 'Paid') {
              acc.paid += 1;
              acc.totalPaid += Number(curr.total_amount);
            } else {
              acc.unpaid += 1;
              acc.totalUnpaid += Number(curr.total_amount);
            }
            
            return acc;
          },
          { paid: 0, unpaid: 0, totalPaid: 0, totalUnpaid: 0 }
        );

        setDashboardData({
          lpoStatusSummary,
          paymentSummary: {
            paid: paymentStatusSummary.paid,
            unpaid: paymentStatusSummary.unpaid,
            partial: 0,
            totalAmount: monthlySpend.reduce((sum, curr) => sum + curr.amount, 0),
            paidAmount: paymentStatusSummary.totalPaid,
          },
          paymentStatusSummary,
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
