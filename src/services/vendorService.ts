
import { collection, addDoc, getDocs, query, where, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Vendor } from '@/types';

const COLLECTION_NAME = 'vendors';

export const vendorService = {
  async createVendor(vendor: Omit<Vendor, "id">): Promise<Vendor> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), vendor);
      return {
        id: docRef.id,
        ...vendor
      };
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw error;
    }
  },

  async getVendors(): Promise<Vendor[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vendor[];
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  },

  async getVendorByEmail(email: string): Promise<Vendor | null> {
    try {
      const q = query(collection(db, COLLECTION_NAME), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Vendor;
    } catch (error) {
      console.error('Error fetching vendor by email:', error);
      throw error;
    }
  }
};
