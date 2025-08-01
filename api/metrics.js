import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Metrics API endpoint
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const tenantId = req.headers['x-tenant-id'] || 'default';
    const { timeframe = '24h', type = 'overview' } = req.query;

    // Calculate time range based on timeframe
    const timeRanges = {
      '1h': new Date(Date.now() - 60 * 60 * 1000),
      '24h': new Date(Date.now() - 24 * 60 * 60 * 1000),
      '7d': new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    };

    const startTime = timeRanges[timeframe] || timeRanges['24h'];

    switch (type) {
      case 'overview':
        return handleOverviewMetrics(req, res, tenantId, startTime);
      case 'performance':
        return handlePerformanceMetrics(req, res, tenantId, startTime);
      case 'agents':
        return handleAgentMetrics(req, res, tenantId, startTime);
      case 'errors':
        return handleErrorMetrics(req, res, tenantId, startTime);
      default:
        return handleOverviewMetrics(req, res, tenantId, startTime);
    }
  } catch (error) {
    console.error('Metrics API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// Get overview metrics
async function handleOverviewMetrics(req, res, tenantId, startTime) {
  try {
    // Get metrics from the last timeframe
    const { data: metrics, error: metricsError } = await supabase
      .from('agent_metrics')
      .select('*')
      .eq('tenant_id', tenantId)
      .gte('created_at', startTime.toISOString())
      .order('created_at', { ascending: false });

    if (metricsError) {
      throw metricsError;
    }

    // Get agent information
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .eq('tenant_id', tenantId);

    if (agentsError) {
      throw agentsError;
    }

    // Calculate overview statistics
    const stats = calculateOverviewStats(metrics || [], agents || []);

    return res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Overview metrics error:', error);
    return res.status(500).json({ error: 'Failed to fetch overview metrics' });
  }
}

// Get performance metrics over time
async function handlePerformanceMetrics(req, res, tenantId, startTime) {
  try {
    const { data: metrics, error } = await supabase
      .from('agent_metrics')
      .select('*')
      .eq('tenant_id', tenantId)
      .gte('created_at', startTime.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    // Group metrics by time intervals
    const performanceData = groupMetricsByTime(metrics || []);

    return res.status(200).json({
      success: true,
      data: performanceData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Performance metrics error:', error);
    return res.status(500).json({ error: 'Failed to fetch performance metrics' });
  }
}

// Get agent-specific metrics
async function handleAgentMetrics(req, res, tenantId, startTime) {
  try {
    // Get agents with their metrics
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select(`
        *,
        agent_metrics!inner(*)
      `)
      .eq('tenant_id', tenantId)
      .gte('agent_metrics.created_at', startTime.toISOString());

    if (agentsError) {
      throw agentsError;
    }

    // Process agent metrics
    const agentStats = processAgentMetrics(agents || []);

    return res.status(200).json({
      success: true,
      data: agentStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Agent metrics error:', error);
    return res.status(500).json({ error: 'Failed to fetch agent metrics' });
  }
}

// Get error metrics
async function handleErrorMetrics(req, res, tenantId, startTime) {
  try {
    const { data: metrics, error } = await supabase
      .from('agent_metrics')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('metric_type', 'error')
      .gte('created_at', startTime.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Process error metrics
    const errorStats = processErrorMetrics(metrics || []);

    return res.status(200).json({
      success: true,
      data: errorStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error metrics error:', error);
    return res.status(500).json({ error: 'Failed to fetch error metrics' });
  }
}

// Helper function to calculate overview statistics
function calculateOverviewStats(metrics, agents) {
  const responseTimeMetrics = metrics.filter(m => m.metric_type === 'response_time');
  const successRateMetrics = metrics.filter(m => m.metric_type === 'success_rate');
  const throughputMetrics = metrics.filter(m => m.metric_type === 'throughput');
  const errorMetrics = metrics.filter(m => m.metric_type === 'error');

  const avgResponseTime = responseTimeMetrics.length > 0
    ? Math.round(responseTimeMetrics.reduce((sum, m) => sum + m.metric_value, 0) / responseTimeMetrics.length)
    : 0;

  const avgSuccessRate = successRateMetrics.length > 0
    ? Math.round((successRateMetrics.reduce((sum, m) => sum + m.metric_value, 0) / successRateMetrics.length) * 100) / 100
    : 0;

  const totalThroughput = throughputMetrics.reduce((sum, m) => sum + m.metric_value, 0);
  const errorRate = errorMetrics.length > 0 ? (errorMetrics.length / metrics.length) * 100 : 0;

  return {
    avgResponseTime,
    successRate: avgSuccessRate,
    totalRequests: metrics.length,
    throughput: totalThroughput,
    errorRate: Math.round(errorRate * 100) / 100,
    activeAgents: agents.filter(a => a.status === 'active').length,
    totalAgents: agents.length
  };
}

// Helper function to group metrics by time intervals
function groupMetricsByTime(metrics) {
  // Group by hour for simplicity
  const grouped = {};
  
  metrics.forEach(metric => {
    const hour = new Date(metric.created_at).getHours();
    const timeKey = `${hour.toString().padStart(2, '0')}:00`;
    
    if (!grouped[timeKey]) {
      grouped[timeKey] = {
        time: timeKey,
        response_time: [],
        success_rate: [],
        throughput: [],
        error_rate: []
      };
    }
    
    if (metric.metric_type === 'response_time') {
      grouped[timeKey].response_time.push(metric.metric_value);
    } else if (metric.metric_type === 'success_rate') {
      grouped[timeKey].success_rate.push(metric.metric_value * 100);
    } else if (metric.metric_type === 'throughput') {
      grouped[timeKey].throughput.push(metric.metric_value);
    } else if (metric.metric_type === 'error') {
      grouped[timeKey].error_rate.push(1);
    }
  });

  // Calculate averages for each time slot
  return Object.values(grouped).map(slot => ({
    time: slot.time,
    response_time: slot.response_time.length > 0 ? Math.round(slot.response_time.reduce((a, b) => a + b, 0) / slot.response_time.length) : 0,
    success_rate: slot.success_rate.length > 0 ? Math.round(slot.success_rate.reduce((a, b) => a + b, 0) / slot.success_rate.length) : 100,
    throughput: slot.throughput.length > 0 ? Math.round(slot.throughput.reduce((a, b) => a + b, 0) / slot.throughput.length) : 0,
    error_rate: slot.error_rate.length > 0 ? Math.round((slot.error_rate.length / (slot.response_time.length + slot.success_rate.length + slot.throughput.length + slot.error_rate.length)) * 100) : 0
  }));
}

// Helper function to process agent metrics
function processAgentMetrics(agents) {
  return agents.map(agent => {
    const metrics = agent.agent_metrics || [];
    const responseTimeMetrics = metrics.filter(m => m.metric_type === 'response_time');
    const successRateMetrics = metrics.filter(m => m.metric_type === 'success_rate');
    const throughputMetrics = metrics.filter(m => m.metric_type === 'throughput');
    const errorMetrics = metrics.filter(m => m.metric_type === 'error');

    return {
      agent: agent.name,
      type: agent.type,
      response_time: responseTimeMetrics.length > 0 
        ? Math.round(responseTimeMetrics.reduce((sum, m) => sum + m.metric_value, 0) / responseTimeMetrics.length)
        : 0,
      success_rate: successRateMetrics.length > 0
        ? Math.round((successRateMetrics.reduce((sum, m) => sum + m.metric_value, 0) / successRateMetrics.length) * 100)
        : 100,
      throughput: throughputMetrics.reduce((sum, m) => sum + m.metric_value, 0),
      errors: errorMetrics.length,
      uptime: agent.status === 'active' ? 100 : 0
    };
  });
}

// Helper function to process error metrics
function processErrorMetrics(errorMetrics) {
  const errorCategories = {};
  
  errorMetrics.forEach(metric => {
    const category = metric.metadata?.error_type || 'Unknown';
    errorCategories[category] = (errorCategories[category] || 0) + 1;
  });

  const total = Object.values(errorCategories).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(errorCategories).map(([category, count]) => ({
    category,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0
  }));
}