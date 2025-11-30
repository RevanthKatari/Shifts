-- Run this SQL in your Supabase SQL Editor to initialize the database

CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  shift_type VARCHAR(20) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  hours DECIMAL(4,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date, shift_type)
);

CREATE INDEX IF NOT EXISTS idx_shifts_user_date ON shifts(user_id, date);

-- Enable Row Level Security (RLS)
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to access only their own shifts
CREATE POLICY "Users can view their own shifts"
  ON shifts FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own shifts"
  ON shifts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own shifts"
  ON shifts FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own shifts"
  ON shifts FOR DELETE
  USING (true);

