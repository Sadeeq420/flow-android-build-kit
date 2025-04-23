
-- Add payment_status column to lpos table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'lpos' 
    AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE public.lpos 
    ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'Unpaid';
  END IF;
END $$;

-- Make sure we have the right indexes for performance
CREATE INDEX IF NOT EXISTS idx_lpos_payment_status ON public.lpos(payment_status);
CREATE INDEX IF NOT EXISTS idx_lpos_status ON public.lpos(status);

-- Ensure data consistency in existing records
UPDATE public.lpos SET payment_status = 'Unpaid' WHERE payment_status IS NULL;
