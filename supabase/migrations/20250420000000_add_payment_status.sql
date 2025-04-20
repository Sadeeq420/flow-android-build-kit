
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
    ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'Yet To Be Paid';
  END IF;
END $$;
