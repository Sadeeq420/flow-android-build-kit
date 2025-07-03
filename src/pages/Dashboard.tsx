
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { lpoService } from "@/services/lpoService";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar, DollarSign, FileText, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import { Lpo, Vendor, PaymentStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface SupplierData {
  vendor: Vendor;
  lpos: Lpo[];
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  totalLpos: number;
  pendingLpos: number;
  overdueLpos: number;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSupplierData = async () => {
    try {
      setLoading(true);
      
      // Fetch all vendors with their LPOs
      const { data: vendorsData, error: vendorsError } = await supabase
        .from('vendors')
        .select(`
          id,
          name,
          email,
          phone,
          address,
          bank_name,
          account_number,
          account_name
        `);

      if (vendorsError) throw vendorsError;

      // Fetch all LPOs with vendor information
      const { data: lposData, error: lposError } = await supabase
        .from('lpos')
        .select(`
          id,
          lpo_number,
          serial_number,
          date_created,
          due_date,
          total_amount,
          payment_status,
          status,
          vendor_id,
          vendor:vendors(name)
        `)
        .order('date_created', { ascending: false });

      if (lposError) throw lposError;

      // Group LPOs by vendor and calculate metrics
      const supplierMap = new Map<string, SupplierData>();
      
      // Initialize all vendors
      vendorsData?.forEach(vendor => {
        supplierMap.set(vendor.id, {
          vendor,
          lpos: [],
          totalAmount: 0,
          paidAmount: 0,
          unpaidAmount: 0,
          totalLpos: 0,
          pendingLpos: 0,
          overdueLpos: 0
        });
      });

      // Process LPOs
      lposData?.forEach(lpo => {
        if (!lpo.vendor_id) return;
        
        const supplierData = supplierMap.get(lpo.vendor_id);
        if (!supplierData) return;

        const lpoData: Lpo = {
          id: lpo.id,
          lpoNumber: lpo.lpo_number || lpo.serial_number || '',
          vendorId: lpo.vendor_id,
          vendorName: lpo.vendor?.name || '',
          dateCreated: lpo.date_created,
          status: lpo.status,
          paymentStatus: lpo.payment_status as PaymentStatus,
          totalAmount: Number(lpo.total_amount),
          items: [],
          paidAmount: lpo.payment_status === 'Paid' ? Number(lpo.total_amount) : 0,
          payments: [],
          createdBy: ''
        };

        supplierData.lpos.push(lpoData);
        supplierData.totalAmount += Number(lpo.total_amount);
        supplierData.totalLpos += 1;

        if (lpo.payment_status === 'Paid') {
          supplierData.paidAmount += Number(lpo.total_amount);
        } else {
          supplierData.unpaidAmount += Number(lpo.total_amount);
        }

        if (lpo.status === 'Pending') {
          supplierData.pendingLpos += 1;
        }

        // Check if overdue
        if (lpo.due_date && new Date(lpo.due_date) < new Date() && lpo.payment_status !== 'Paid') {
          supplierData.overdueLpos += 1;
        }
      });

      setSuppliers(Array.from(supplierMap.values()).filter(s => s.totalLpos > 0));
    } catch (error) {
      console.error('Error fetching supplier data:', error);
      toast.error('Failed to load supplier data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierData();

    // Set up real-time subscription
    const channel = supabase
      .channel('supplier-dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lpos'
        },
        () => {
          fetchSupplierData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vendors'
        },
        () => {
          fetchSupplierData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'Paid': return 'bg-success text-success-foreground';
      case 'Unpaid': return 'bg-destructive text-destructive-foreground';
      case 'Partial': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background-muted to-background-subtle flex flex-col">
        <Header user={user} onLogout={logout} />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center space-y-4 animate-in">
            <div className="animate-pulse">
              <TrendingUp className="h-12 w-12 mx-auto text-primary" />
            </div>
            <p className="text-foreground-muted text-lg">Loading real-time supplier dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-muted to-background-subtle flex flex-col">
      <Header user={user} onLogout={logout} />
      
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 animate-in">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Real-time Supplier Dashboard</h1>
            <p className="text-foreground-muted text-lg">Live overview of all suppliers with their LPO status and payments</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate("/lpo-create")}
              className="silky-button bg-gradient-to-r from-primary to-primary-hover text-primary-foreground"
            >
              <FileText className="h-4 w-4 mr-2" />
              New LPO
            </Button>
            <Button 
              onClick={() => navigate("/email-report")}
              className="silky-button bg-gradient-to-r from-accent to-accent-hover text-accent-foreground"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </div>
        
        {suppliers.length === 0 ? (
          <div className="text-center py-16 animate-in">
            <div className="mb-6">
              <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Supplier Data</h3>
            <p className="text-foreground-muted mb-6">Start by creating your first LPO to see supplier data here.</p>
            <Button 
              onClick={() => navigate("/lpo-create")}
              className="silky-button bg-gradient-to-r from-primary to-primary-hover text-primary-foreground"
            >
              Create First LPO
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {suppliers.map((supplier, index) => (
              <Card 
                key={supplier.vendor.id} 
                className="hover-lift glass-card border-card-border/50 backdrop-blur-sm group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold mb-1 gradient-text">
                        {supplier.vendor.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-foreground-muted">
                        {supplier.vendor.email}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="text-xs">
                        {supplier.totalLpos} LPO{supplier.totalLpos !== 1 ? 's' : ''}
                      </Badge>
                      {supplier.overdueLpos > 0 && (
                        <Badge className="bg-destructive text-destructive-foreground text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {supplier.overdueLpos} Overdue
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Financial Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-primary-muted">
                      <DollarSign className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-xs text-foreground-muted mb-1">Total Amount</p>
                      <p className="font-semibold text-sm">{formatCurrency(supplier.totalAmount)}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-success/10">
                      <div className="text-success text-xs font-medium mb-1">Paid</div>
                      <div className="font-semibold text-sm">{formatCurrency(supplier.paidAmount)}</div>
                      <div className="text-destructive text-xs font-medium mt-1">Unpaid</div>
                      <div className="font-semibold text-sm">{formatCurrency(supplier.unpaidAmount)}</div>
                    </div>
                  </div>

                  {/* Recent LPOs */}
                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      Recent LPOs
                    </h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {supplier.lpos.slice(0, 5).map((lpo) => (
                        <div key={lpo.id} className="p-3 rounded-lg bg-background-muted/50 border border-card-border/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-xs font-medium text-primary">
                              {lpo.lpoNumber}
                            </span>
                            <div className="flex gap-1">
                              <Badge 
                                className={`text-xs ${getStatusColor(lpo.status)}`}
                              >
                                {lpo.status}
                              </Badge>
                              <Badge 
                                className={`text-xs ${getPaymentStatusColor(lpo.paymentStatus)}`}
                              >
                                {lpo.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-foreground-muted">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(lpo.dateCreated)}
                            </div>
                            <span className="font-semibold">
                              {formatCurrency(lpo.totalAmount)}
                            </span>
                          </div>
                        </div>
                      ))}
                      {supplier.lpos.length > 5 && (
                        <div className="text-center">
                          <span className="text-xs text-foreground-muted">
                            +{supplier.lpos.length - 5} more LPOs
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  {supplier.pendingLpos > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-md bg-warning/10 border border-warning/20">
                      <span className="text-xs text-warning-foreground">Pending Approval</span>
                      <Badge className="bg-warning text-warning-foreground text-xs">
                        {supplier.pendingLpos}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
