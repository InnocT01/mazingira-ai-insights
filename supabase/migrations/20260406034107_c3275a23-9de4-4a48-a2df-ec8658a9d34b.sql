
-- Create role enum
CREATE TYPE public.user_role AS ENUM ('farmer', 'researcher', 'organization');
CREATE TYPE public.contribution_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');
CREATE TYPE public.scan_status AS ENUM ('pending', 'completed', 'failed');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'farmer',
  avatar_url TEXT,
  bio TEXT,
  organization_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Farms table
CREATE TABLE public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  area_hectares DOUBLE PRECISION,
  crop_type TEXT,
  soil_type TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own farms" ON public.farms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own farms" ON public.farms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own farms" ON public.farms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own farms" ON public.farms FOR DELETE USING (auth.uid() = user_id);

-- Soil scans table
CREATE TABLE public.soil_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
  scan_type TEXT NOT NULL DEFAULT 'quick',
  results JSONB DEFAULT '{}',
  status scan_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.soil_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scans" ON public.soil_scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own scans" ON public.soil_scans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scans" ON public.soil_scans FOR UPDATE USING (auth.uid() = user_id);

-- Contributions table (Ushahidi-inspired)
CREATE TABLE public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  data_type TEXT NOT NULL DEFAULT 'climate',
  region TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  format TEXT DEFAULT 'CSV',
  file_url TEXT,
  metadata JSONB DEFAULT '{}',
  status contribution_status NOT NULL DEFAULT 'pending',
  review_notes TEXT,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved contributions" ON public.contributions FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);
CREATE POLICY "Users can create contributions" ON public.contributions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contributions" ON public.contributions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own contributions" ON public.contributions FOR DELETE USING (auth.uid() = user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON public.farms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_soil_scans_updated_at BEFORE UPDATE ON public.soil_scans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contributions_updated_at BEFORE UPDATE ON public.contributions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for contributions
ALTER PUBLICATION supabase_realtime ADD TABLE public.contributions;
