import { useState, useEffect, useCallback } from 'react';
import apiService from '@/lib/api';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = useCallback(async (fetchFunction, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    data,
    fetchData
  };
}

export function useSystemStatus() {
  const [systemStatus, setSystemStatus] = useState({
    agents: { total: 0, active: 0 },
    tasks: { completed: 0, running: 0, failed: 0 },
    performance: { avgResponseTime: 0, successRate: 0 },
    health: 'unknown'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshSystemStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const status = await apiService.getSystemStatus();
      
      if (status.status === 'healthy' && status.metrics) {
        setSystemStatus({
          agents: {
            total: status.metrics.totalAgents || 0,
            active: status.metrics.activeAgents || 0
          },
          tasks: {
            completed: status.metrics.completedTasks || 0,
            running: status.metrics.runningTasks || 0,
            failed: status.metrics.failedTasks || 0
          },
          performance: {
            avgResponseTime: status.metrics.avgResponseTime || 0,
            successRate: status.metrics.successRate || 0
          },
          health: 'healthy'
        });
      } else {
        setSystemStatus(prev => ({ ...prev, health: 'error' }));
      }
    } catch (err) {
      setError(err.message);
      setSystemStatus(prev => ({ ...prev, health: 'error' }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSystemStatus();
  }, [refreshSystemStatus]);

  return {
    systemStatus,
    loading,
    error,
    refreshSystemStatus
  };
}

export function useMetrics(timeframe = '24h') {
  const [metrics, setMetrics] = useState({
    performance: [],
    agents: [],
    errors: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [performance, agents, errors] = await Promise.all([
        apiService.getPerformanceMetrics(timeframe),
        apiService.getAgentMetrics(timeframe),
        apiService.getErrorMetrics(timeframe)
      ]);

      setMetrics({
        performance: performance.data || [],
        agents: agents.data || [],
        errors: errors.data || []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    fetchMetrics
  };
}

export function useRecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const activities = await apiService.getRecentActivity();
      setActivities(activities);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    fetchActivities
  };
}