-- Fix search_path for the free license eligibility functions
CREATE OR REPLACE FUNCTION is_free_license_eligible()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (SELECT COUNT(*) FROM licenses WHERE type = 'individual') < 1000;
$$;

CREATE OR REPLACE FUNCTION is_free_club_eligible()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (SELECT COUNT(*) FROM clubs WHERE status = 'approved') < 50;
$$;