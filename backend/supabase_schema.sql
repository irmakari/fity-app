-- ============================================================
-- FITTY APP - SUPABASE POSTGRESQL SCHEMA MIGRATION SCRIPT
-- ============================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  age INT,
  height_cm NUMERIC,
  current_weight_kg NUMERIC,
  target_weight_kg NUMERIC,
  goal_type TEXT,
  fitness_level TEXT,
  weekly_workout_target INT,
  activity_level TEXT,
  training_location TEXT,
  focus_muscles TEXT[] DEFAULT '{}',
  notification_workout_reminders BOOLEAN DEFAULT true,
  notification_water_reminders BOOLEAN DEFAULT true,
  notification_weekly_reports BOOLEAN DEFAULT true,
  is_onboarded BOOLEAN DEFAULT false,
  password_reset_otp TEXT,
  password_reset_otp_expires TIMESTAMPTZ,
  password_reset_token TEXT,
  password_reset_token_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. EXERCISES TABLE
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  target_muscle TEXT,
  secondary_muscles TEXT[] DEFAULT '{}',
  equipment TEXT,
  description TEXT,
  instructions TEXT[] DEFAULT '{}',
  gif_url TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. WORKOUT PLANS TABLE
CREATE TABLE IF NOT EXISTS workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  day_label TEXT,
  target_muscles TEXT[] DEFAULT '{}',
  estimated_duration_min INT,
  exercises JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. WORKOUT SESSIONS TABLE
CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'in_progress',
  started_at TIMESTAMPTZ DEFAULT now(),
  finished_at TIMESTAMPTZ,
  total_duration_sec INT DEFAULT 0,
  calories_burned NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. WORKOUT SESSION SETS TABLE
CREATE TABLE IF NOT EXISTS workout_session_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  set_number INT NOT NULL,
  reps INT DEFAULT 0,
  weight_kg NUMERIC DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. WORKOUT EXERCISE STATUSES TABLE
CREATE TABLE IF NOT EXISTS workout_exercise_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  personal_record_weight_kg NUMERIC DEFAULT 0,
  personal_record_reps INT DEFAULT 0,
  last_performed_at TIMESTAMPTZ,
  total_volume_kg NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, exercise_id)
);

-- 7. FOODS TABLE
CREATE TABLE IF NOT EXISTS foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  barcode TEXT,
  brand TEXT,
  serving_size TEXT,
  serving_size_g NUMERIC DEFAULT 100,
  calories NUMERIC DEFAULT 0,
  protein_g NUMERIC DEFAULT 0,
  carbs_g NUMERIC DEFAULT 0,
  fat_g NUMERIC DEFAULT 0,
  fiber_g NUMERIC DEFAULT 0,
  sugar_g NUMERIC DEFAULT 0,
  source TEXT DEFAULT 'custom',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. MEAL LOGS TABLE
CREATE TABLE IF NOT EXISTS meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  meal_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. MEAL ITEMS TABLE
CREATE TABLE IF NOT EXISTS meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_log_id UUID REFERENCES meal_logs(id) ON DELETE CASCADE NOT NULL,
  food_id UUID REFERENCES foods(id) ON DELETE CASCADE NOT NULL,
  quantity NUMERIC DEFAULT 1,
  calories NUMERIC DEFAULT 0,
  protein_g NUMERIC DEFAULT 0,
  carbs_g NUMERIC DEFAULT 0,
  fat_g NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. HYDRATION LOGS TABLE
CREATE TABLE IF NOT EXISTS hydration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  amount_ml NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. HYDRATION GOALS TABLE
CREATE TABLE IF NOT EXISTS hydration_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  daily_target_ml NUMERIC DEFAULT 2500,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 12. NUTRITION GOALS TABLE
CREATE TABLE IF NOT EXISTS nutrition_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  daily_calories NUMERIC DEFAULT 2000,
  protein_g NUMERIC DEFAULT 150,
  carbs_g NUMERIC DEFAULT 200,
  fat_g NUMERIC DEFAULT 65,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 13. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_meal_logs_user_date ON meal_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_hydration_logs_user_date ON hydration_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_started ON workout_sessions(user_id, started_at);
CREATE INDEX IF NOT EXISTS idx_workout_session_sets_session ON workout_session_sets(workout_session_id);
CREATE INDEX IF NOT EXISTS idx_meal_items_meal_log ON meal_items(meal_log_id);

-- SAMPLE INITIAL EXERCISES
INSERT INTO exercises (name, category, target_muscle, equipment, description) VALUES
('Bench Press', 'Chest', 'Chest', 'Barbell', 'Büyük göğüs kaslarını (Pectoralis Major) çalıştıran temel itiş hareketi.'),
('Squat', 'Legs', 'Legs', 'Barbell', 'Bacak ve kalça kaslarını hedefleyen temel alt vücut egzersizi.'),
('Deadlift', 'Back', 'Back', 'Barbell', 'Tüm arka zincir kaslarını güçlendiren bileşik hareket.'),
('Push-Up (Şınav)', 'Chest', 'Chest', 'Bodyweight', 'Vücut ağırlığı ile göğüs ve triceps çalıştıran klasik hareket.'),
('Pull-Up (Barfiks)', 'Back', 'Back', 'Bodyweight', 'Kanat ve sırt kaslarını geliştiren üst vücut çekiş hareketi.')
ON CONFLICT DO NOTHING;

-- SAMPLE INITIAL FOODS
INSERT INTO foods (name, calories, protein_g, carbs_g, fat_g, serving_size_g, serving_size, source) VALUES
('Yumurta (Haşlanmış)', 155, 13, 1.1, 11, 100, '100g (yaklaşık 2 adet)', 'custom'),
('Tavuk Göğsü (Izgara)', 165, 31, 0, 3.6, 100, '100g', 'custom'),
('Beyaz Peynir', 260, 15, 2.5, 21, 100, '100g', 'custom'),
('Pirinç Pilavı', 130, 2.7, 28, 0.3, 100, '100g', 'custom'),
('Yulaf Ezmesi', 389, 16.9, 66, 6.9, 100, '100g', 'custom')
ON CONFLICT DO NOTHING;
