-- NurseForce Database Schema for Supabase
-- Run this script in your Supabase SQL Editor to create all required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SHIFTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  facility TEXT NOT NULL,
  shift_type TEXT NOT NULL CHECK (shift_type IN ('AM', 'PM', 'ND')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  ward TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'filled', 'confirmed', 'cancelled')),
  assigned_staff_id UUID,
  assigned_staff_name TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  rationale TEXT,
  cost DECIMAL(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_shifts_date ON shifts(date);
CREATE INDEX IF NOT EXISTS idx_shifts_facility ON shifts(facility);
CREATE INDEX IF NOT EXISTS idx_shifts_status ON shifts(status);
CREATE INDEX IF NOT EXISTS idx_shifts_assigned_staff ON shifts(assigned_staff_id);

-- ============================================================================
-- STAFF TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('RN', 'EN', 'AIN', 'Midwife')),
  type TEXT NOT NULL CHECK (type IN ('hospital', 'casual', 'agency')),
  email TEXT,
  phone TEXT,
  ahpra_number TEXT,
  ahpra_expiry DATE,
  police_check_expiry DATE,
  wwcc_expiry DATE,
  skills JSONB DEFAULT '[]'::jsonb,
  preferred_locations JSONB DEFAULT '[]'::jsonb,
  availability JSONB DEFAULT '{}'::jsonb,
  hourly_rate DECIMAL(10, 2),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_staff_name ON staff(name);
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_type ON staff(type);
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);

-- ============================================================================
-- WARDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS wards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  facility TEXT NOT NULL,
  total_beds INTEGER NOT NULL DEFAULT 0,
  open_beds INTEGER NOT NULL DEFAULT 0,
  closed_pm INTEGER DEFAULT 0,
  closed_nd INTEGER DEFAULT 0,
  closed_am INTEGER DEFAULT 0,
  pm_rostered INTEGER DEFAULT 0,
  pm_vacancy INTEGER DEFAULT 0,
  pm_sick INTEGER DEFAULT 0,
  pm_surplus INTEGER DEFAULT 0,
  nd_rostered INTEGER DEFAULT 0,
  nd_vacancy INTEGER DEFAULT 0,
  nd_sick INTEGER DEFAULT 0,
  nd_surplus INTEGER DEFAULT 0,
  am_rostered INTEGER DEFAULT 0,
  am_vacancy INTEGER DEFAULT 0,
  am_sick INTEGER DEFAULT 0,
  am_surplus INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_wards_facility ON wards(facility);
CREATE INDEX IF NOT EXISTS idx_wards_name ON wards(name);

-- ============================================================================
-- DEPLOYMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  shift TEXT NOT NULL CHECK (shift IN ('PM', 'ND', 'AM')),
  from_ward TEXT NOT NULL,
  to_ward TEXT NOT NULL,
  staff_id UUID NOT NULL,
  staff_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  sms_sent BOOLEAN NOT NULL DEFAULT false,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_deployments_date ON deployments(date);
CREATE INDEX IF NOT EXISTS idx_deployments_staff ON deployments(staff_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);

-- ============================================================================
-- PROVIDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('agency', 'contractor')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  abn TEXT,
  contract_start DATE,
  contract_end DATE,
  rate_card JSONB DEFAULT '{}'::jsonb,
  performance_rating DECIMAL(3, 2),
  total_shifts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_providers_name ON providers(name);
CREATE INDEX IF NOT EXISTS idx_providers_type ON providers(type);
CREATE INDEX IF NOT EXISTS idx_providers_status ON providers(status);

-- ============================================================================
-- AUDIT LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_shifts_updated_at
  BEFORE UPDATE ON shifts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at
  BEFORE UPDATE ON staff
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wards_updated_at
  BEFORE UPDATE ON wards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deployments_updated_at
  BEFORE UPDATE ON deployments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_providers_updated_at
  BEFORE UPDATE ON providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - OPTIONAL
-- ============================================================================
-- Uncomment these if you want to enable RLS for additional security
-- For now, we'll leave it disabled for easier development

-- ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE wards ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations for authenticated users
-- CREATE POLICY "Allow all for authenticated users" ON shifts FOR ALL TO authenticated USING (true);
-- CREATE POLICY "Allow all for authenticated users" ON staff FOR ALL TO authenticated USING (true);
-- CREATE POLICY "Allow all for authenticated users" ON wards FOR ALL TO authenticated USING (true);
-- CREATE POLICY "Allow all for authenticated users" ON deployments FOR ALL TO authenticated USING (true);
-- CREATE POLICY "Allow all for authenticated users" ON providers FOR ALL TO authenticated USING (true);
-- CREATE POLICY "Allow all for authenticated users" ON audit_logs FOR ALL TO authenticated USING (true);

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
-- Grant access to anon and authenticated users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE 'NurseForce database schema created successfully!';
  RAISE NOTICE 'Tables created: shifts, staff, wards, deployments, providers, audit_logs';
  RAISE NOTICE 'You can now use the NurseForce application with Supabase.';
END $$;
