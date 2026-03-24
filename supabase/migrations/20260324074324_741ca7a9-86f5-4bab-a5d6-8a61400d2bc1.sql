
-- Fix overly permissive policies

-- Profiles: only the trigger inserts, so restrict to service_role (drop and recreate)
DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;
CREATE POLICY "Trigger inserts profiles" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications: restrict inserts to users inserting for themselves or admins
DROP POLICY IF EXISTS "Insert notifications" ON public.notifications;
CREATE POLICY "Insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Approval requests: restrict to company users inserting for their own company
DROP POLICY IF EXISTS "Anyone can insert approval" ON public.approval_requests;
CREATE POLICY "Company users can insert approvals" ON public.approval_requests FOR INSERT TO authenticated WITH CHECK (
  company_id IN (SELECT id FROM public.waste_companies WHERE user_id = auth.uid())
);
