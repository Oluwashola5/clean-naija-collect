
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'company', 'household');
CREATE TYPE public.pickup_status AS ENUM ('Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled');
CREATE TYPE public.issue_status AS ENUM ('New', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed');
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Service areas
CREATE TABLE public.service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  lga TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Waste companies
CREATE TABLE public.waste_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  registration_number TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  status approval_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Company service areas (many-to-many)
CREATE TABLE public.company_service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.waste_companies(id) ON DELETE CASCADE,
  service_area_id UUID NOT NULL REFERENCES public.service_areas(id) ON DELETE CASCADE,
  UNIQUE(company_id, service_area_id)
);

-- Household profiles
CREATE TABLE public.household_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  lga TEXT NOT NULL,
  state TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pickup requests
CREATE TABLE public.pickup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.household_profiles(id) ON DELETE CASCADE,
  household_name TEXT NOT NULL,
  address TEXT NOT NULL,
  service_area_id UUID REFERENCES public.service_areas(id),
  company_id UUID REFERENCES public.waste_companies(id),
  company_name TEXT,
  waste_type TEXT NOT NULL,
  description TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  status pickup_status NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Issue reports
CREATE TABLE public.issue_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES public.household_profiles(id) ON DELETE CASCADE,
  household_name TEXT NOT NULL,
  address TEXT NOT NULL,
  service_area_id UUID REFERENCES public.service_areas(id),
  company_id UUID REFERENCES public.waste_companies(id),
  company_name TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  status issue_status NOT NULL DEFAULT 'New',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Approval requests
CREATE TABLE public.approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.waste_companies(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  status approval_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_waste_companies_updated_at BEFORE UPDATE ON public.waste_companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pickup_requests_updated_at BEFORE UPDATE ON public.pickup_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_issue_reports_updated_at BEFORE UPDATE ON public.issue_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper to get current user role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "System can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- USER ROLES policies
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own role" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- SERVICE AREAS policies
CREATE POLICY "Anyone can view service areas" ON public.service_areas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage service areas" ON public.service_areas FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- WASTE COMPANIES policies
CREATE POLICY "View companies" ON public.waste_companies FOR SELECT TO authenticated USING (status = 'approved' OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Company users can insert own" ON public.waste_companies FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update companies" ON public.waste_companies FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);

-- COMPANY SERVICE AREAS policies
CREATE POLICY "Anyone can view company service areas" ON public.company_service_areas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage company service areas" ON public.company_service_areas FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- HOUSEHOLD PROFILES policies
CREATE POLICY "Households can view own" ON public.household_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Households can insert own" ON public.household_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Households can update own" ON public.household_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- PICKUP REQUESTS policies
CREATE POLICY "View pickups" ON public.pickup_requests FOR SELECT TO authenticated USING (
  household_id IN (SELECT id FROM public.household_profiles WHERE user_id = auth.uid())
  OR company_id IN (SELECT id FROM public.waste_companies WHERE user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Households can create pickups" ON public.pickup_requests FOR INSERT TO authenticated WITH CHECK (
  household_id IN (SELECT id FROM public.household_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Update pickups" ON public.pickup_requests FOR UPDATE TO authenticated USING (
  company_id IN (SELECT id FROM public.waste_companies WHERE user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

-- ISSUE REPORTS policies
CREATE POLICY "View issues" ON public.issue_reports FOR SELECT TO authenticated USING (
  household_id IN (SELECT id FROM public.household_profiles WHERE user_id = auth.uid())
  OR company_id IN (SELECT id FROM public.waste_companies WHERE user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Households can create issues" ON public.issue_reports FOR INSERT TO authenticated WITH CHECK (
  household_id IN (SELECT id FROM public.household_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Update issues" ON public.issue_reports FOR UPDATE TO authenticated USING (
  company_id IN (SELECT id FROM public.waste_companies WHERE user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

-- NOTIFICATIONS policies
CREATE POLICY "View own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

-- APPROVAL REQUESTS policies
CREATE POLICY "Admins can view approvals" ON public.approval_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can insert approval" ON public.approval_requests FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update approvals" ON public.approval_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for issue images
INSERT INTO storage.buckets (id, name, public) VALUES ('issue-images', 'issue-images', true);
CREATE POLICY "Anyone can view issue images" ON storage.objects FOR SELECT USING (bucket_id = 'issue-images');
CREATE POLICY "Authenticated can upload issue images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'issue-images');
