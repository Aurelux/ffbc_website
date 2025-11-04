-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'organizer', 'club_admin', 'player');
CREATE TYPE public.license_status AS ENUM ('pending', 'approved', 'rejected', 'expired');
CREATE TYPE public.license_type AS ENUM ('individual', 'club');
CREATE TYPE public.tournament_type AS ENUM ('local', 'regional', 'national');
CREATE TYPE public.tournament_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  emergency_contact TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- User roles policies
CREATE POLICY "User roles are viewable by everyone" 
ON public.user_roles FOR SELECT 
USING (true);

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create clubs table
CREATE TABLE public.clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  region TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  president_name TEXT,
  affiliation_date DATE,
  status public.license_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

-- Clubs policies
CREATE POLICY "Clubs are viewable by everyone" 
ON public.clubs FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert clubs" 
ON public.clubs FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update clubs" 
ON public.clubs FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create licenses table
CREATE TABLE public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_number TEXT UNIQUE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  club_id UUID REFERENCES public.clubs(id) ON DELETE SET NULL,
  type public.license_type NOT NULL,
  status public.license_status DEFAULT 'pending',
  identity_document_url TEXT,
  photo_url TEXT,
  address_proof_url TEXT,
  medical_certificate_url TEXT,
  club_membership_proof_url TEXT,
  issue_date DATE,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- Licenses policies
CREATE POLICY "Users can view their own licenses" 
ON public.licenses FOR SELECT 
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own license application" 
ON public.licenses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update licenses" 
ON public.licenses FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create tournaments table
CREATE TABLE public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type public.tournament_type NOT NULL,
  status public.tournament_status DEFAULT 'upcoming',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  city TEXT,
  region TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  entry_fee DECIMAL(10, 2),
  organizer_id UUID REFERENCES public.profiles(id),
  club_id UUID REFERENCES public.clubs(id),
  coefficient DECIMAL(3, 1) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

-- Tournaments policies
CREATE POLICY "Tournaments are viewable by everyone" 
ON public.tournaments FOR SELECT 
USING (true);

CREATE POLICY "Organizers and admins can create tournaments" 
ON public.tournaments FOR INSERT 
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'organizer')
);

CREATE POLICY "Organizers can update their own tournaments" 
ON public.tournaments FOR UPDATE 
USING (
  public.has_role(auth.uid(), 'admin') OR 
  (public.has_role(auth.uid(), 'organizer') AND organizer_id = auth.uid())
);

-- Create tournament_registrations table
CREATE TABLE public.tournament_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_name TEXT,
  partner_id UUID REFERENCES public.profiles(id),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  payment_status TEXT DEFAULT 'pending',
  checked_in BOOLEAN DEFAULT false,
  UNIQUE(tournament_id, user_id)
);

ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;

-- Tournament registrations policies
CREATE POLICY "Users can view tournament registrations" 
ON public.tournament_registrations FOR SELECT 
USING (true);

CREATE POLICY "Users can register for tournaments" 
ON public.tournament_registrations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations" 
ON public.tournament_registrations FOR UPDATE 
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Create matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round_number INTEGER,
  table_number INTEGER,
  team_a_player1_id UUID REFERENCES public.profiles(id),
  team_a_player2_id UUID REFERENCES public.profiles(id),
  team_b_player1_id UUID REFERENCES public.profiles(id),
  team_b_player2_id UUID REFERENCES public.profiles(id),
  team_a_score INTEGER,
  team_b_score INTEGER,
  team_a_points INTEGER,
  team_b_points INTEGER,
  winner TEXT,
  match_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Matches policies
CREATE POLICY "Matches are viewable by everyone" 
ON public.matches FOR SELECT 
USING (true);

CREATE POLICY "Organizers and admins can create matches" 
ON public.matches FOR INSERT 
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'organizer')
);

CREATE POLICY "Organizers and admins can update matches" 
ON public.matches FOR UPDATE 
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'organizer')
);

-- Create rankings table
CREATE TABLE public.rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  season TEXT NOT NULL,
  total_points INTEGER DEFAULT 0,
  matches_played INTEGER DEFAULT 0,
  matches_won INTEGER DEFAULT 0,
  matches_drawn INTEGER DEFAULT 0,
  matches_lost INTEGER DEFAULT 0,
  rank INTEGER,
  previous_rank INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, season)
);

ALTER TABLE public.rankings ENABLE ROW LEVEL SECURITY;

-- Rankings policies
CREATE POLICY "Rankings are viewable by everyone" 
ON public.rankings FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clubs_updated_at
BEFORE UPDATE ON public.clubs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_licenses_updated_at
BEFORE UPDATE ON public.licenses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at
BEFORE UPDATE ON public.tournaments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
BEFORE UPDATE ON public.matches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email
  );
  
  -- Assign default player role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'player');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();