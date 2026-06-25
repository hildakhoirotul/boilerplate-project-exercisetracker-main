-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create exercises table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  duration INTEGER NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- RLS policies for users (public read/write for exercise tracker app)
CREATE POLICY "users_select" ON users FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "users_insert" ON users FOR INSERT TO anon, authenticated WITH CHECK (true);

-- RLS policies for exercises (public read/write for exercise tracker app)
CREATE POLICY "exercises_select" ON exercises FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "exercises_insert" ON exercises FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_exercises_user_id ON exercises(user_id);
CREATE INDEX idx_exercises_date ON exercises(date);