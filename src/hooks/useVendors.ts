
import { useState, useEffect } from 'react';
import { vendorService } from '@/services/vendorService';
import { Vendor } from '@/types';
import { toast } from 'sonner';

export const useVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await vendorService.getVendors();
        setVendors(data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        toast.error('Failed to load vendors');
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return { vendors, setVendors, loading };
};
