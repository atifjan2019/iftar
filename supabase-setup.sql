-- Create the registrations table for Oldham Brothers Iftar Event
CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  ticket_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add a unique constraint on email to prevent duplicates at DB level
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_email_unique 
  ON registrations (LOWER(email));

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anon role (public registration)
CREATE POLICY "Allow public inserts" ON registrations
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow reads from anon role (needed for count and admin stats via API)
CREATE POLICY "Allow public reads" ON registrations
  FOR SELECT TO anon
  USING (true);
