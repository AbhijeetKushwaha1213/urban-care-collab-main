-- Worker System Database Migration
-- Run this in your Supabase SQL Editor

-- 1. Update users table to support worker user type
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- Update user_type enum to include worker
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'worker';

-- 2. Create workers table
CREATE TABLE IF NOT EXISTS workers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    department VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create worker_tasks table (for task assignments)
CREATE TABLE IF NOT EXISTS worker_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    worker_notes TEXT,
    before_image TEXT,
    after_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Update issues table to support new worker statuses
ALTER TYPE issue_status ADD VALUE IF NOT EXISTS 'assigned';
ALTER TYPE issue_status ADD VALUE IF NOT EXISTS 'completed_by_worker';
ALTER TYPE issue_status ADD VALUE IF NOT EXISTS 'pending_review';

-- Add worker assignment fields to issues table
ALTER TABLE issues 
ADD COLUMN IF NOT EXISTS assigned_worker_id UUID REFERENCES workers(id),
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS worker_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS worker_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS worker_notes TEXT,
ADD COLUMN IF NOT EXISTS after_image TEXT;

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workers_employee_id ON workers(employee_id);
CREATE INDEX IF NOT EXISTS idx_workers_phone ON workers(phone_number);
CREATE INDEX IF NOT EXISTS idx_workers_department ON workers(department);
CREATE INDEX IF NOT EXISTS idx_workers_active ON workers(is_active);

CREATE INDEX IF NOT EXISTS idx_worker_tasks_worker_id ON worker_tasks(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_tasks_issue_id ON worker_tasks(issue_id);
CREATE INDEX IF NOT EXISTS idx_worker_tasks_status ON worker_tasks(status);
CREATE INDEX IF NOT EXISTS idx_worker_tasks_assigned_at ON worker_tasks(assigned_at);

CREATE INDEX IF NOT EXISTS idx_issues_assigned_worker ON issues(assigned_worker_id);
CREATE INDEX IF NOT EXISTS idx_issues_status_worker ON issues(status) WHERE status IN ('assigned', 'completed_by_worker', 'pending_review');

-- 6. Create RLS (Row Level Security) policies for workers

-- Workers can only see their own profile
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can view own profile" ON workers
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Workers can update own profile" ON workers
    FOR UPDATE USING (user_id = auth.uid());

-- Workers can only see their assigned tasks
ALTER TABLE worker_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can view own tasks" ON worker_tasks
    FOR SELECT USING (
        worker_id IN (
            SELECT id FROM workers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Workers can update own tasks" ON worker_tasks
    FOR UPDATE USING (
        worker_id IN (
            SELECT id FROM workers WHERE user_id = auth.uid()
        )
    );

-- Authorities can manage all worker tasks
CREATE POLICY "Authorities can manage worker tasks" ON worker_tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type = 'authority'
        )
    );

-- 7. Create functions for worker operations

-- Function to assign issue to worker
CREATE OR REPLACE FUNCTION assign_issue_to_worker(
    p_issue_id UUID,
    p_worker_id UUID,
    p_assigned_by UUID
) RETURNS BOOLEAN AS $$
BEGIN
    -- Update issue status and assignment
    UPDATE issues 
    SET 
        status = 'assigned',
        assigned_worker_id = p_worker_id,
        assigned_at = NOW(),
        updated_at = NOW()
    WHERE id = p_issue_id;
    
    -- Create worker task record
    INSERT INTO worker_tasks (
        issue_id,
        worker_id,
        assigned_by,
        status
    ) VALUES (
        p_issue_id,
        p_worker_id,
        p_assigned_by,
        'pending'
    );
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete task by worker
CREATE OR REPLACE FUNCTION complete_task_by_worker(
    p_task_id UUID,
    p_after_image TEXT,
    p_worker_notes TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_issue_id UUID;
BEGIN
    -- Get issue ID and update task
    UPDATE worker_tasks 
    SET 
        status = 'completed',
        completed_at = NOW(),
        after_image = p_after_image,
        worker_notes = p_worker_notes,
        updated_at = NOW()
    WHERE id = p_task_id
    RETURNING issue_id INTO v_issue_id;
    
    -- Update issue status
    UPDATE issues 
    SET 
        status = 'completed_by_worker',
        worker_completed_at = NOW(),
        after_image = p_after_image,
        worker_notes = p_worker_notes,
        updated_at = NOW()
    WHERE id = v_issue_id;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Insert sample worker data (for testing)
-- Note: You'll need to create user accounts first, then reference them here

-- Example worker creation (replace with actual user IDs after creating accounts)
/*
INSERT INTO workers (employee_id, full_name, phone_number, department, user_id) VALUES
('EMP001', 'राज कुमार', '+91-9876543210', 'Infrastructure', 'user-uuid-here'),
('EMP002', 'सुनीता शर्मा', '+91-9876543211', 'Electricity', 'user-uuid-here'),
('EMP003', 'अमित पटेल', '+91-9876543212', 'Water', 'user-uuid-here');
*/

-- 9. Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workers_updated_at 
    BEFORE UPDATE ON workers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_worker_tasks_updated_at 
    BEFORE UPDATE ON worker_tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON workers TO authenticated;
GRANT SELECT, INSERT, UPDATE ON worker_tasks TO authenticated;
GRANT USAGE ON SEQUENCE workers_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE worker_tasks_id_seq TO authenticated;

-- Success message
SELECT 'Worker system tables and functions created successfully!' as result;