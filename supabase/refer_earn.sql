-- Safely add new columns to users table for referrals
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='referral_code') THEN
    ALTER TABLE users ADD COLUMN referral_code TEXT UNIQUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='referred_by') THEN
    ALTER TABLE users ADD COLUMN referred_by TEXT;
  END IF;
END $$;

-- Referrals Table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  referred_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(referred_id)
);

-- Reward Claims Table
CREATE TABLE IF NOT EXISTS reward_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  upi_id TEXT NOT NULL,
  amount INTEGER DEFAULT 100,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_claims ENABLE ROW LEVEL SECURITY;

-- Referrals Policies
DROP POLICY IF EXISTS "Users can view their own referrals" ON referrals;
CREATE POLICY "Users can view their own referrals" ON referrals FOR SELECT USING (referrer_id = current_setting('request.jwt.claims')::json->>'sub' OR referred_id = current_setting('request.jwt.claims')::json->>'sub');

DROP POLICY IF EXISTS "Users can insert referrals" ON referrals;
CREATE POLICY "Users can insert referrals" ON referrals FOR INSERT WITH CHECK (true); -- Allow insertion from API logic

-- Reward Claims Policies
DROP POLICY IF EXISTS "Users can view their own reward claims" ON reward_claims;
CREATE POLICY "Users can view their own reward claims" ON reward_claims FOR SELECT USING (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

DROP POLICY IF EXISTS "Users can insert their own reward claims" ON reward_claims;
CREATE POLICY "Users can insert their own reward claims" ON reward_claims FOR INSERT WITH CHECK (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

-- Add to Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE referrals, reward_claims;
