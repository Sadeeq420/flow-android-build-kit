
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Updated utility function for Naira formatting that accepts different value types
export function formatCurrency(amount: number | string): string {
  // Convert string to number if needed
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if it's a valid number
  if (isNaN(numericAmount)) {
    return '₦0.00';
  }
  
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericAmount);
}
