
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardData, MonthlySpend, VendorSpend } from '@/types';
import { toast } from 'sonner';

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const { data: lposData, error: lposError } = await supabase
        .from('lpos')
        .select(`
          id,
          status,
          payment_status,
          date_created,
          total_amount,
          vendor:vendors(id, name)
        `);

      if (lposError) {
        console.error('Error fetching LPO data:', lposError);
        throw lposError;
      }

      if (!lposData || lposData.length === 0) {
        setDashboardData({
          lpoStatusSummary: { pending: 0, approved: 0, rejected: 0 },
          paymentSummary: {
            paid: 0,
            unpaid: 0,
            partial: 0,
            totalAmount: 0,
            paidAmount: 0,
          },
          paymentStatusSummary: {
            paid: 0,
            unpaid: 0,
            totalPaid: 0,
            totalUnpaid: 0,
          },
          monthlySpend: [],
          topVendors: [],
          upcomingReminders: [],
          emailReportHistory: [],
        });
        setLoading(false);
        return;
      }

      const monthlySpend: MonthlySpend[] = lposData.reduce((acc: MonthlySpend[], curr) => {
        const month = new Date(curr.date_created).toLocaleString('default', { month: 'short' });
        const isPaid = curr.payment_status === 'Paid';
        const existingMonth = acc.find(item => item.month === month);
        
        if (existingMonth) {
          existingMonth.amount += Number(curr.total_amount);
          if (isPaid) {
            existingMonth.paidAmount += Number(curr.total_amount);
          }
        } else {
          acc.push({
            month,
            amount: Number(curr.total_amount),
            date: curr.date_created,
            paidAmount: isPaid ? Number(curr.total_amount) : 0
          });
        }
        return acc;
      }, []);

      const vendorSpend: VendorSpend[] = lposData.reduce((acc: VendorSpend[], curr) => {
        const vendorId = curr.vendor?.id;
        if (!vendorId) return acc;
        
        const existingVendor = acc.find(item => item.vendorId === vendorId);
        
        if (existingVendor) {
          existingVendor.totalSpend += Number(curr.total_amount);
        } else if (curr.vendor) {
          acc.push({
            vendorId,
            vendorName: curr.vendor?.name || 'Unknown Vendor',
            totalSpend: Number(curr.total_amount)
          });
        }
        return acc;
      }, []).sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 5);

      const lpoStatusSummary = lposData.reduce((acc: any, curr) => {
        const status = curr.status.toLowerCase();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, { pending: 0, approved: 0, rejected: 0 });

      const paymentStatusSummary = lposData.reduce((acc: any, curr) => {
        const isPaid = curr.payment_status === 'Paid';
        
        if (isPaid) {
          acc.paid += 1;
          acc.totalPaid += Number(curr.total_amount);
        } else {
          acc.unpaid += 1;
          acc.totalUnpaid += Number(curr.total_amount);
        }
        
        return acc;
      }, { paid: 0, unpaid: 0, totalPaid: 0, totalUnpaid: 0 });

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

  useEffect(() => {
    fetchDashboardData();

    // Set up real-time subscription
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lpos'
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { dashboardData, loading };
};
