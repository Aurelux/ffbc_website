-- Add score validation field to matches
ALTER TABLE matches ADD COLUMN IF NOT EXISTS score_validated BOOLEAN DEFAULT false;

-- Add validation timestamp
ALTER TABLE matches ADD COLUMN IF NOT EXISTS validated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS validated_by UUID REFERENCES auth.users(id);

-- Update RLS on tournaments to allow licensed players to create tournaments
DROP POLICY IF EXISTS "Organizers and admins can create tournaments" ON tournaments;
CREATE POLICY "Licensed players and admins can create tournaments"
ON tournaments
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'organizer'::app_role) OR
  EXISTS (
    SELECT 1 FROM licenses 
    WHERE user_id = auth.uid() 
    AND status = 'approved'
  )
);

-- Update RLS on tournaments to allow creators to update their own tournaments
DROP POLICY IF EXISTS "Organizers can update their own tournaments" ON tournaments;
CREATE POLICY "Creators and admins can update tournaments"
ON tournaments
FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  (organizer_id = auth.uid())
);

-- Update RLS on matches to allow tournament creators to enter scores
DROP POLICY IF EXISTS "Organizers and admins can update matches" ON matches;
CREATE POLICY "Tournament creators and admins can update matches"
ON matches
FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  EXISTS (
    SELECT 1 FROM tournaments 
    WHERE id = matches.tournament_id 
    AND organizer_id = auth.uid()
  )
);

-- Update RLS on matches to allow tournament creators to create matches
DROP POLICY IF EXISTS "Organizers and admins can create matches" ON matches;
CREATE POLICY "Tournament creators and admins can create matches"
ON matches
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR
  EXISTS (
    SELECT 1 FROM tournaments 
    WHERE id = matches.tournament_id 
    AND organizer_id = auth.uid()
  )
);

-- Create function to check if user should get free license (first 1000 users)
CREATE OR REPLACE FUNCTION is_free_license_eligible()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT (SELECT COUNT(*) FROM licenses WHERE type = 'individual') < 1000;
$$;

-- Create function to check if club should get free affiliation (first 50 clubs)
CREATE OR REPLACE FUNCTION is_free_club_eligible()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT (SELECT COUNT(*) FROM clubs WHERE status = 'approved') < 50;
$$;