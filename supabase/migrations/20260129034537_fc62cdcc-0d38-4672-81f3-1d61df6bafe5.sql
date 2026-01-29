-- Create a catalog table for products/services
CREATE TABLE public.catalog_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  rate NUMERIC NOT NULL DEFAULT 0,
  unit TEXT DEFAULT 'un',
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user access
CREATE POLICY "Users can view own catalog items" 
ON public.catalog_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own catalog items" 
ON public.catalog_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own catalog items" 
ON public.catalog_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own catalog items" 
ON public.catalog_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_catalog_items_updated_at
BEFORE UPDATE ON public.catalog_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();