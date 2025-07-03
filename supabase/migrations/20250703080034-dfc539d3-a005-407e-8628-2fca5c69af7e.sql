
-- Insert a predefined admin user (you'll need to replace with actual credentials)
-- First, let's create a simple admin credentials table for demonstration
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users (only accessible by authenticated users)
CREATE POLICY "Authenticated users can view admin users" ON public.admin_users
  FOR SELECT TO authenticated USING (true);

-- Insert a default admin user (password: 'admin123' - you should change this)
-- Note: In production, use proper password hashing
INSERT INTO public.admin_users (email, password_hash, name) 
VALUES ('admin@qumecs.com', '$2b$10$rQZ9QNlXnH5YtOe6xF.Km.3xGwJbm5xN8YQhV6wV5Kg3Gt4xkLxNu', 'Admin User');

-- Update LPO table to include more fields for the dashboard
ALTER TABLE public.lpos ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE public.lpos ADD COLUMN IF NOT EXISTS serial_number TEXT;

-- Create a function to generate serial numbers for LPOs
CREATE OR REPLACE FUNCTION generate_serial_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.serial_number IS NULL THEN
    NEW.serial_number := 'LPO-' || TO_CHAR(NEW.date_created, 'YYYY') || '-' || 
                        LPAD(NEXTVAL('lpo_serial_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for LPO serial numbers
CREATE SEQUENCE IF NOT EXISTS lpo_serial_seq START 1;

-- Create trigger for LPO serial number generation
DROP TRIGGER IF EXISTS set_lpo_serial_number ON public.lpos;
CREATE TRIGGER set_lpo_serial_number
  BEFORE INSERT ON public.lpos
  FOR EACH ROW
  EXECUTE FUNCTION generate_serial_number();

-- Add indexes for better dashboard performance
CREATE INDEX IF NOT EXISTS idx_lpos_payment_status ON public.lpos(payment_status);
CREATE INDEX IF NOT EXISTS idx_lpos_due_date ON public.lpos(due_date);
CREATE INDEX IF NOT EXISTS idx_lpos_serial_number ON public.lpos(serial_number);
