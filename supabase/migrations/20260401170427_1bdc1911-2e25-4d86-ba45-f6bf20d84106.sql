
CREATE TABLE public.addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  label TEXT NOT NULL DEFAULT 'home',
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  lga TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Users can view their own addresses, admins can view all
CREATE POLICY "Users can view own addresses" ON public.addresses
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Users can insert their own addresses
CREATE POLICY "Users can insert own addresses" ON public.addresses
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own addresses, admins can update any
CREATE POLICY "Users can update own addresses" ON public.addresses
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

-- Users can delete their own addresses, admins can delete any
CREATE POLICY "Users can delete own addresses" ON public.addresses
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
