const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check
  async getHealth() {
    return this.request('/health');
  }

  // Get metrics
  async getMetrics(type = 'overview', timeframe = '24h') {
    return this.request(`/metrics?type=${type}&timeframe=${timeframe}`);
  }

  // Get performance metrics
  async getPerformanceMetrics(timeframe = '24h') {
    return this.request(`/metrics?type=performance&timeframe=${timeframe}`);
  }

  // Get agent metrics
  async getAgentMetrics(timeframe = '24h') {
    return this.request(`/metrics?type=agents&timeframe=${timeframe}`);
  }

  // Get error metrics
  async getErrorMetrics(timeframe = '24h') {
    return this.request(`/metrics?type=errors&timeframe=${timeframe}`);
  }

  // Get system status
  async getSystemStatus() {
    try {
      const [health, metrics] = await Promise.all([
        this.getHealth(),
        this.getMetrics('overview', '24h')
      ]);

      return {
        status: 'healthy',
        health,
        metrics: metrics.data || {},
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get recent activity
  async getRecentActivity() {
    try {
      const metrics = await this.getMetrics('overview', '1h');
      return metrics.data?.recentActivity || [];
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
      return [];
    }
  }

  // Get agent status
  async getAgentStatus() {
    try {
      const agentMetrics = await this.getAgentMetrics('24h');
      return agentMetrics.data?.agents || [];
    } catch (error) {
      console.error('Failed to fetch agent status:', error);
      return [];
    }
  }
}

export const apiService = new ApiService();
export default apiService;