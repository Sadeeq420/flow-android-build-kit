
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
      .insert([{
        vendor_id: lpoData.vendorId,
        total_amount: lpoData.totalAmount,
        additional_percentage: lpoData.additionalPercentage,
        additional_notes: lpoData.additionalNotes,
        created_by: user.user.id,
      }])
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
      `);

    if (lposError) throw lposError;

    return lpos.map(lpo => ({
      id: lpo.id,
      vendorId: lpo.vendor_id,
      vendorName: lpo.vendor.name,
      dateCreated: lpo.date_created,
      status: lpo.status,
      paymentStatus: lpo.payment_status as PaymentStatus,
      items: lpo.items.map((item: any) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        totalPrice: item.total_price,
      })),
      totalAmount: lpo.total_amount,
      paidAmount: 0, // We'll need to calculate this from payments
      payments: [], // We'll need to fetch this separately
      createdBy: lpo.created_by,
    }));
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
      .update({ payment_status: paymentStatus })
      .eq('id', id);

    if (error) throw error;
  },

  async deleteLpo(id: string): Promise<void> {
    const { error } = await supabase
      .from('lpos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
