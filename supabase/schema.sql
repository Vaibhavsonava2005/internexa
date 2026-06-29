-- Supabase PostgreSQL Schema for InterNexa

-- 0. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'student',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  is_profile_complete BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 0,
  skills JSONB DEFAULT '[]'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,
  bio TEXT,
  college TEXT,
  degree TEXT,
  year TEXT,
  phone TEXT,
  github TEXT,
  linkedin TEXT,
  portfolio TEXT,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1. Internships Table
CREATE TABLE IF NOT EXISTS internships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  duration TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  rating FLOAT DEFAULT 0,
  total_enrolled INTEGER DEFAULT 0,
  seats_available INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  thumbnail TEXT,
  banner TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  tools JSONB DEFAULT '[]'::jsonb,
  modules JSONB DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  outcomes JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
  reference_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Submitted',
  resume_file_id TEXT NOT NULL,
  offer_letter_file_id TEXT,
  offer_letter_id TEXT,
  
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college_name TEXT NOT NULL,
  university TEXT NOT NULL,
  current_semester TEXT NOT NULL,
  degree TEXT NOT NULL,
  branch TEXT NOT NULL,
  expected_graduation_year TEXT NOT NULL,
  
  current_skills TEXT NOT NULL,
  github_profile TEXT,
  linkedin_profile TEXT,
  portfolio TEXT,
  
  preferred_domain TEXT NOT NULL,
  preferred_start_date TEXT NOT NULL,
  available_hours TEXT NOT NULL,
  preferred_duration TEXT NOT NULL,
  
  career_goals TEXT NOT NULL,
  why_join TEXT NOT NULL,
  previous_experience TEXT,
  
  terms_accepted BOOLEAN NOT NULL DEFAULT true,
  submission_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safely add new columns to applications table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='application_id') THEN
    ALTER TABLE applications ADD COLUMN application_id TEXT UNIQUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='offer_expires_at') THEN
    ALTER TABLE applications ADD COLUMN offer_expires_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- 3. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  razorpay_order_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'Pending',
  invoice_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target_user_id TEXT,
  details TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Realtime Setup
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
ALTER PUBLICATION supabase_realtime ADD TABLE applications, notifications;

-- Policies for Users
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

-- Policies for Internships
DROP POLICY IF EXISTS "Internships are viewable by everyone" ON internships;
CREATE POLICY "Internships are viewable by everyone" ON internships FOR SELECT USING (true);

-- Policies for Applications
DROP POLICY IF EXISTS "Users can insert their own applications" ON applications;
CREATE POLICY "Users can insert their own applications" ON applications FOR INSERT WITH CHECK (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

DROP POLICY IF EXISTS "Users can view their own applications" ON applications;
CREATE POLICY "Users can view their own applications" ON applications FOR SELECT USING (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

-- Policies for Transactions
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

DROP POLICY IF EXISTS "Users can insert their own transactions" ON transactions;
CREATE POLICY "Users can insert their own transactions" ON transactions FOR INSERT WITH CHECK (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

DROP POLICY IF EXISTS "Users can update their own transactions" ON transactions;
CREATE POLICY "Users can update their own transactions" ON transactions FOR UPDATE USING (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

-- Policies for Notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

-- Policies for Activity Logs
DROP POLICY IF EXISTS "Users can view their own activity logs" ON activity_logs;
CREATE POLICY "Users can view their own activity logs" ON activity_logs FOR SELECT USING (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

DROP POLICY IF EXISTS "Users can insert their own activity logs" ON activity_logs;
CREATE POLICY "Users can insert their own activity logs" ON activity_logs FOR INSERT WITH CHECK (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

 - -   7 .   M a n u a l   P a y m e n t s   T a b l e 
 C R E A T E   T A B L E   I F   N O T   E X I S T S   m a n u a l _ p a y m e n t s   ( 
     i d   U U I D   D E F A U L T   g e n _ r a n d o m _ u u i d ( )   P R I M A R Y   K E Y , 
     a p p l i c a t i o n _ i d   U U I D   R E F E R E N C E S   a p p l i c a t i o n s ( i d )   O N   D E L E T E   C A S C A D E , 
     c l e r k _ i d   T E X T   N O T   N U L L   R E F E R E N C E S   u s e r s ( c l e r k _ i d )   O N   D E L E T E   C A S C A D E , 
     r e f e r e n c e _ n u m b e r   T E X T   N O T   N U L L , 
     e m a i l _ i d   T E X T   N O T   N U L L , 
     u p i _ i d   T E X T   N O T   N U L L , 
     s c r e e n s h o t _ f i l e _ i d   T E X T   N O T   N U L L , 
     s t a t u s   T E X T   D E F A U L T   ' P e n d i n g ' , 
     c r e a t e d _ a t   T I M E S T A M P   W I T H   T I M E   Z O N E   D E F A U L T   t i m e z o n e ( ' u t c ' : : t e x t ,   n o w ( ) )   N O T   N U L L 
 ) ; 
  
 
-- 7. Course Curriculum Tables
CREATE TABLE IF NOT EXISTS modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  internship_id UUID NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  week_number INTEGER NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  content_url TEXT,
  description TEXT,
  duration TEXT,
  day_number INTEGER NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Completed',
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(clerk_id, lesson_id)
);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules are viewable by everyone" ON modules FOR SELECT USING (true);
CREATE POLICY "Lessons are viewable by everyone" ON lessons FOR SELECT USING (true);
CREATE POLICY "Users can view their own progress" ON lesson_progress FOR SELECT USING (clerk_id = current_setting('request.jwt.claims')::json->>'sub');
CREATE POLICY "Users can insert their own progress" ON lesson_progress FOR INSERT WITH CHECK (clerk_id = current_setting('request.jwt.claims')::json->>'sub');
CREATE POLICY "Users can update their own progress" ON lesson_progress FOR UPDATE USING (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

