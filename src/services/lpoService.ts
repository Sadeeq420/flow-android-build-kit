
import { supabase } from '@/integrations/supabase/client';
import { Lpo, LpoItem, PaymentStatus } from '@/types';

export const lpoService = {
  async createLpo(lpoData: {
    vendorId: string;
    items: LpoItem[];
    totalAmount: number;
    additionalPercentage: number;
    additionalNotes?: string;
  }): Promise<string> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data: lpo, error: lpoError } = await supabase
      .from('lpos')
      .insert({
        vendor_id: lpoData.vendorId,
        total_amount: lpoData.totalAmount,
        additional_percentage: lpoData.additionalPercentage,
        additional_notes: lpoData.additionalNotes,
        user_id: user.user.id
      })
      .select()
      .single();

    if (lpoError) throw lpoError;

    // Insert LPO items
    const lpoItems = lpoData.items.map(item => ({
      lpo_id: lpo.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
    }));

    const { error: itemsError } = await supabase
      .from('lpo_items')
      .insert(lpoItems);

    if (itemsError) throw itemsError;

    return lpo.id;
  },

  async getLpos(): Promise<Lpo[]> {
    const { data: lpos, error: lposError } = await supabase
      .from('lpos')
      .select(`
        *,
        vendor:vendors(id, name),
        items:lpo_items(*)
      `)
      .order('date_created', { ascending: false });

    if (lposError) throw lposError;

    return lpos.map(lpo => ({
      id: lpo.id,
      lpoNumber: lpo.lpo_number || this.generateShortLpoId(lpo.id, lpo.date_created),
      vendorId: lpo.vendor_id,
      vendorName: lpo.vendor.name,
      dateCreated: lpo.date_created,
      status: lpo.status,
      paymentStatus: ((lpo as any).payment_status as PaymentStatus) || 'Unpaid',
      items: lpo.items.map((item: any) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        totalPrice: item.total_price,
      })),
      totalAmount: lpo.total_amount,
      paidAmount: 0,
      payments: [],
      createdBy: lpo.user_id,
    }));
  },

  generateShortLpoId(id: string, dateCreated: string): string {
    // Extract first 4 characters of UUID + month/year
    const shortId = id.substring(0, 4).toUpperCase();
    const date = new Date(dateCreated);
    const monthYear = `${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getFullYear()).slice(-2)}`;
    return `${shortId}-${monthYear}`;
  },

  async updateLpoStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('lpos')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  },

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<void> {
    const { error } = await supabase
      .from('lpos')
      .update({ payment_status: paymentStatus } as any)
      .eq('id', id);

    if (error) throw error;
  },

  async deleteLpo(id: string): Promise<void> {
    try {
      // Use a transaction-like approach to ensure all related data is deleted
      // First, delete associated LPO items
      const { error: itemsError } = await supabase
        .from('lpo_items')
        .delete()
        .eq('lpo_id', id);

      if (itemsError) {
        console.error('Error deleting LPO items:', itemsError);
        throw itemsError;
      }

      // Then delete any associated payments
      const { error: paymentsError } = await supabase
        .from('lpo_payments')
        .delete()
        .eq('lpo_id', id);

      if (paymentsError) {
        console.error('Error deleting LPO payments:', paymentsError);
        throw paymentsError;
      }

      // Finally delete the LPO itself
      const { error: lpoError } = await supabase
        .from('lpos')
        .delete()
        .eq('id', id);

      if (lpoError) {
        console.error('Error deleting LPO:', lpoError);
        throw lpoError;
      }

      console.log('LPO deleted successfully:', id);
    } catch (error) {
      console.error('Error in deleteLpo function:', error);
      throw new Error('Failed to delete LPO. Please try again.');
    }
  }
};
