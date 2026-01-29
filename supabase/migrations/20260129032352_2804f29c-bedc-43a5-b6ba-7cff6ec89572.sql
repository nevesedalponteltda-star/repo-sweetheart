-- Create table for recurring invoices
CREATE TABLE public.recurring_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  
  -- Template data (copied to each generated invoice)
  invoice_template JSONB NOT NULL,
  
  -- Recurrence settings
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'bimonthly', 'quarterly', 'semiannual', 'annual')),
  start_date DATE NOT NULL,
  end_date DATE,
  next_invoice_date DATE NOT NULL,
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Tracking
  invoices_generated INTEGER NOT NULL DEFAULT 0,
  last_generated_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recurring_invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own recurring invoices"
ON public.recurring_invoices
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recurring invoices"
ON public.recurring_invoices
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recurring invoices"
ON public.recurring_invoices
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recurring invoices"
ON public.recurring_invoices
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_recurring_invoices_updated_at
BEFORE UPDATE ON public.recurring_invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();