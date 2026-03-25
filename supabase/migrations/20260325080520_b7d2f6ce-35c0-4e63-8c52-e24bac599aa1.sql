
-- Add status column to service_areas for pause/active functionality
ALTER TABLE public.service_areas ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

-- Create company_requests table for household-company selection
CREATE TABLE public.company_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL REFERENCES public.household_profiles(id),
  company_id uuid NOT NULL REFERENCES public.waste_companies(id),
  household_name text NOT NULL,
  company_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.company_requests ENABLE ROW LEVEL SECURITY;

-- Households can create requests
CREATE POLICY "Households can create company requests"
  ON public.company_requests FOR INSERT TO authenticated
  WITH CHECK (household_id IN (SELECT id FROM household_profiles WHERE user_id = auth.uid()));

-- Households can view own requests
CREATE POLICY "Households can view own company requests"
  ON public.company_requests FOR SELECT TO authenticated
  USING (
    household_id IN (SELECT id FROM household_profiles WHERE user_id = auth.uid())
    OR company_id IN (SELECT id FROM waste_companies WHERE user_id = auth.uid())
    OR has_role(auth.uid(), 'admin')
  );

-- Companies can update requests sent to them
CREATE POLICY "Companies can update company requests"
  ON public.company_requests FOR UPDATE TO authenticated
  USING (company_id IN (SELECT id FROM waste_companies WHERE user_id = auth.uid()));

-- Admins can manage all
CREATE POLICY "Admins manage company requests"
  ON public.company_requests FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Add delete policy for service_areas for admins
CREATE POLICY "Admins can delete service areas"
  ON public.service_areas FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Add update policy for service_areas for admins (for pause/resume)
CREATE POLICY "Admins can update service areas"
  ON public.service_areas FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Add insert policy for service_areas for admins
CREATE POLICY "Admins can insert service areas"
  ON public.service_areas FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));
