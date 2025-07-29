-- FMAA Database Schema
-- Federated Micro-Agents Architecture

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET row_security = on;

-- Tenants table for multi-tenancy support
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    subscription_tier VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    auth_provider VARCHAR(50) DEFAULT 'supabase',
    auth_provider_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agents registry
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- sentiment-analysis, recommendation, performance-monitor
    status VARCHAR(50) DEFAULT 'inactive', -- active, inactive, error, deploying
    config JSONB DEFAULT '{}',
    version VARCHAR(20) DEFAULT '1.0.0',
    endpoint_url TEXT,
    health_check_url TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_health_check TIMESTAMP WITH TIME ZONE
);

-- Agent tasks management
CREATE TABLE agent_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    task_type VARCHAR(100) NOT NULL,
    input_data JSONB NOT NULL,
    output_data JSONB,
    status VARCHAR(50) DEFAULT 'pending', -- pending, running, completed, failed
    priority INTEGER DEFAULT 5,
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent performance metrics
CREATE TABLE agent_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    metric_type VARCHAR(100) NOT NULL, -- response_time, success_rate, error_rate, throughput
    metric_value DECIMAL(10,4) NOT NULL,
    unit VARCHAR(20), -- ms, percentage, requests_per_second
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- System logs
CREATE TABLE agent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    level VARCHAR(20) NOT NULL, -- info, warn, error, debug
    message TEXT NOT NULL,
    context JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent deployments tracking
CREATE TABLE agent_deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL,
    deployment_status VARCHAR(50) DEFAULT 'pending', -- pending, deploying, deployed, failed, rollback
    deployment_config JSONB DEFAULT '{}',
    deployed_by UUID REFERENCES users(id),
    deployed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    rollback_version VARCHAR(20),
    notes TEXT
);

-- Indexes for performance
CREATE INDEX idx_agents_tenant_id ON agents(tenant_id);
CREATE INDEX idx_agents_type ON agents(type);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agent_tasks_agent_id ON agent_tasks(agent_id);
CREATE INDEX idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX idx_agent_tasks_scheduled_at ON agent_tasks(scheduled_at);
CREATE INDEX idx_agent_metrics_agent_id ON agent_metrics(agent_id);
CREATE INDEX idx_agent_metrics_timestamp ON agent_metrics(timestamp);
CREATE INDEX idx_agent_logs_agent_id ON agent_logs(agent_id);
CREATE INDEX idx_agent_logs_timestamp ON agent_logs(timestamp);

-- Row Level Security Policies
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_deployments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenant isolation
CREATE POLICY tenant_isolation_users ON users
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_agents ON agents
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_agent_tasks ON agent_tasks
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_agent_metrics ON agent_metrics
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_agent_logs ON agent_logs
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_agent_deployments ON agent_deployments
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Views for easier data access
CREATE VIEW agent_status_summary AS
SELECT 
    a.tenant_id,
    a.type,
    a.status,
    COUNT(*) as count,
    AVG(CASE WHEN am.metric_type = 'response_time' THEN am.metric_value END) as avg_response_time,
    AVG(CASE WHEN am.metric_type = 'success_rate' THEN am.metric_value END) as avg_success_rate
FROM agents a
LEFT JOIN agent_metrics am ON a.id = am.agent_id 
    AND am.timestamp > NOW() - INTERVAL '1 hour'
GROUP BY a.tenant_id, a.type, a.status;

CREATE VIEW recent_agent_activity AS
SELECT 
    a.id as agent_id,
    a.name as agent_name,
    a.type,
    a.status,
    at.id as task_id,
    at.task_type,
    at.status as task_status,
    at.created_at as task_created_at,
    at.completed_at as task_completed_at
FROM agents a
LEFT JOIN agent_tasks at ON a.id = at.agent_id
WHERE at.created_at > NOW() - INTERVAL '24 hours'
ORDER BY at.created_at DESC;

-- Functions for common operations
CREATE OR REPLACE FUNCTION update_agent_health_check(agent_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE agents 
    SET last_health_check = NOW(),
        updated_at = NOW()
    WHERE id = agent_uuid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_agent_metric(
    agent_uuid UUID,
    tenant_uuid UUID,
    metric_type_param VARCHAR(100),
    metric_value_param DECIMAL(10,4),
    unit_param VARCHAR(20) DEFAULT NULL,
    metadata_param JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO agent_metrics (agent_id, tenant_id, metric_type, metric_value, unit, metadata)
    VALUES (agent_uuid, tenant_uuid, metric_type_param, metric_value_param, unit_param, metadata_param);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default tenant for development
INSERT INTO tenants (name, slug, subscription_tier) 
VALUES ('Default Tenant', 'default', 'premium')
ON CONFLICT (slug) DO NOTHING;

