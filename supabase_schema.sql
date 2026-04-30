-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'volunteer',
  contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  type TEXT NOT NULL, -- food, medical, shelter, etc.
  priority TEXT NOT NULL, -- low, medium, high
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed
  assigned_ngo_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Resources table
CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ngo_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  quantity INTEGER DEFAULT 0,
  location TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(ngo_id, name)
);

-- Reports table
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ngo_id UUID REFERENCES profiles(id) NOT NULL,
  location TEXT NOT NULL,
  people_helped INTEGER DEFAULT 0,
  resources_used TEXT,
  needs TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS) - Basic Setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for development)
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Tasks are viewable by everyone." ON tasks FOR SELECT USING (true);
CREATE POLICY "Only admins can insert tasks." ON tasks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins or assigned NGOs can update tasks." ON tasks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') OR
  assigned_ngo_id = auth.uid()
);

CREATE POLICY "Resources are viewable by everyone." ON resources FOR SELECT USING (true);
CREATE POLICY "NGOs can manage their own resources." ON resources FOR ALL USING (ngo_id = auth.uid());

CREATE POLICY "Reports are viewable by everyone." ON reports FOR SELECT USING (true);
CREATE POLICY "NGOs can insert reports." ON reports FOR INSERT WITH CHECK (ngo_id = auth.uid());
