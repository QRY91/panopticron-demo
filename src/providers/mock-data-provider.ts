// src/providers/mock-data-provider.ts
import { DataProvider } from "@refinedev/core";
import {
  mockData,
  MockProject,
  MockClient,
  MockDeployment,
  MockAlert,
  MockPerformanceMetric,
  MockWorkerRun,
  MockProjectPriorityHistory,
  getProjectById,
  getClientById,
  getProjectsByClient,
  getDeploymentsByProject,
  getAlertsByProject,
  getActiveAlerts,
  getWorkerRunsByName,
  getRecentWorkerRuns,
  getPriorityHistoryByProject,
  getDemoStats,
} from "@/mock-data/demo-data";
import { DEMO_CONFIG } from "@/demo-config";

// Simulate network delay for realistic demo experience
const simulateDelay = (
  ms: number = DEMO_CONFIG.DEMO_DELAYS.LOADING_SIMULATION
) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to simulate pagination
const paginateResults = <T>(
  data: T[],
  pagination?: { current?: number; pageSize?: number }
) => {
  if (!pagination) return data;

  const { current = 1, pageSize = 10 } = pagination;
  const start = (current - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: data.slice(start, end),
    total: data.length,
    hasNext: end < data.length,
    hasPrev: current > 1,
  };
};

// Helper function to apply filters
const applyFilters = <T extends Record<string, any>>(
  data: T[],
  filters?: any[]
): T[] => {
  if (!filters || filters.length === 0) return data;

  return data.filter((item) => {
    return filters.every((filter) => {
      const { field, operator, value } = filter;
      const itemValue = item[field];

      switch (operator) {
        case "eq":
          return itemValue === value;
        case "ne":
          return itemValue !== value;
        case "contains":
          return itemValue
            ?.toString()
            .toLowerCase()
            .includes(value?.toString().toLowerCase());
        case "gte":
          return itemValue >= value;
        case "lte":
          return itemValue <= value;
        case "in":
          return Array.isArray(value) && value.includes(itemValue);
        default:
          return true;
      }
    });
  });
};

// Helper function to apply sorting
const applySorting = <T extends Record<string, any>>(
  data: T[],
  sorters?: any[]
): T[] => {
  if (!sorters || sorters.length === 0) return data;

  return [...data].sort((a, b) => {
    for (const sorter of sorters) {
      const { field, order } = sorter;
      const aValue = a[field];
      const bValue = b[field];

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      if (comparison !== 0) {
        return order === "desc" ? -comparison : comparison;
      }
    }
    return 0;
  });
};

export const mockDataProvider: DataProvider = {
  getApiUrl: () => "http://localhost:3000/api/mock",

  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    await simulateDelay();

    let data: any[] = [];

    switch (resource) {
      case "projects":
        data = mockData.projects;
        break;
      case "clients":
        data = mockData.clients;
        break;
      case "deployments":
        data = mockData.deployments;
        break;
      case "alerts":
        data = mockData.alerts;
        break;
      case "performance":
        data = mockData.performance;
        break;
      case "github":
        data = mockData.github;
        break;
      case "worker_runs":
        data = mockData.workerRuns;
        break;
      case "project_priority_history":
        data = mockData.priorityHistory;
        break;
      default:
        data = [];
    }

    // Apply filters
    const filteredData = applyFilters(data, filters);

    // Apply sorting
    const sortedData = applySorting(filteredData, sorters);

    // Apply pagination
    const paginatedResult = paginateResults(sortedData, pagination);

    return {
      data: Array.isArray(paginatedResult)
        ? paginatedResult
        : paginatedResult.data,
      total: Array.isArray(paginatedResult)
        ? paginatedResult.length
        : paginatedResult.total,
    };
  },

  getOne: async ({ resource, id, meta }) => {
    await simulateDelay(200); // Faster for single items

    let data: any = null;

    switch (resource) {
      case "projects":
        data = getProjectById(id as string);
        break;
      case "clients":
        data = getClientById(id as string);
        break;
      case "deployments":
        data = mockData.deployments.find((d) => d.id === id);
        break;
      case "alerts":
        data = mockData.alerts.find((a) => a.id === id);
        break;
      case "github":
        data = mockData.github.find((g) => g.project_id === id);
        break;
      case "worker_runs":
        data = mockData.workerRuns.find((w) => w.id === id);
        break;
      case "project_priority_history":
        data = mockData.priorityHistory.find((p) => p.id === id);
        break;
      default:
        data = null;
    }

    if (!data) {
      throw new Error(`${resource} with id ${id} not found`);
    }

    return { data };
  },

  create: async ({ resource, variables, meta }) => {
    await simulateDelay(800); // Simulate longer operation

    // Generate new ID
    const newId = `${resource}-${Date.now()}`;
    const newRecord = {
      id: newId,
      ...variables,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to mock data (in a real app, this would persist)
    switch (resource) {
      case "projects":
        mockData.projects.push(newRecord as MockProject);
        break;
      case "clients":
        mockData.clients.push(newRecord as MockClient);
        break;
      case "alerts":
        mockData.alerts.push(newRecord as MockAlert);
        break;
      case "worker_runs":
        mockData.workerRuns.push(newRecord as MockWorkerRun);
        break;
      case "project_priority_history":
        mockData.priorityHistory.push(newRecord as MockProjectPriorityHistory);
        break;
    }

    return { data: newRecord };
  },

  update: async ({ resource, id, variables, meta }) => {
    await simulateDelay(600);

    let updatedRecord: any = null;

    switch (resource) {
      case "projects":
        const projectIndex = mockData.projects.findIndex((p) => p.id === id);
        if (projectIndex !== -1) {
          mockData.projects[projectIndex] = {
            ...mockData.projects[projectIndex],
            ...variables,
            last_updated: new Date().toISOString(),
          };
          updatedRecord = mockData.projects[projectIndex];
        }
        break;
      case "clients":
        const clientIndex = mockData.clients.findIndex((c) => c.id === id);
        if (clientIndex !== -1) {
          mockData.clients[clientIndex] = {
            ...mockData.clients[clientIndex],
            ...variables,
          };
          updatedRecord = mockData.clients[clientIndex];
        }
        break;
      case "alerts":
        const alertIndex = mockData.alerts.findIndex((a) => a.id === id);
        if (alertIndex !== -1) {
          mockData.alerts[alertIndex] = {
            ...mockData.alerts[alertIndex],
            ...variables,
          };
          updatedRecord = mockData.alerts[alertIndex];
        }
        break;
      case "worker_runs":
        const workerIndex = mockData.workerRuns.findIndex((w) => w.id === id);
        if (workerIndex !== -1) {
          mockData.workerRuns[workerIndex] = {
            ...mockData.workerRuns[workerIndex],
            ...variables,
          };
          updatedRecord = mockData.workerRuns[workerIndex];
        }
        break;
      case "project_priority_history":
        const historyIndex = mockData.priorityHistory.findIndex(
          (p) => p.id === id
        );
        if (historyIndex !== -1) {
          mockData.priorityHistory[historyIndex] = {
            ...mockData.priorityHistory[historyIndex],
            ...variables,
          };
          updatedRecord = mockData.priorityHistory[historyIndex];
        }
        break;
    }

    if (!updatedRecord) {
      throw new Error(`${resource} with id ${id} not found`);
    }

    return { data: updatedRecord };
  },

  deleteOne: async ({ resource, id, meta }) => {
    await simulateDelay(400);

    let deletedRecord: any = null;

    switch (resource) {
      case "projects":
        const projectIndex = mockData.projects.findIndex((p) => p.id === id);
        if (projectIndex !== -1) {
          deletedRecord = mockData.projects.splice(projectIndex, 1)[0];
        }
        break;
      case "clients":
        const clientIndex = mockData.clients.findIndex((c) => c.id === id);
        if (clientIndex !== -1) {
          deletedRecord = mockData.clients.splice(clientIndex, 1)[0];
        }
        break;
      case "alerts":
        const alertIndex = mockData.alerts.findIndex((a) => a.id === id);
        if (alertIndex !== -1) {
          deletedRecord = mockData.alerts.splice(alertIndex, 1)[0];
        }
        break;
      case "worker_runs":
        const workerIndex = mockData.workerRuns.findIndex((w) => w.id === id);
        if (workerIndex !== -1) {
          deletedRecord = mockData.workerRuns.splice(workerIndex, 1)[0];
        }
        break;
      case "project_priority_history":
        const historyIndex = mockData.priorityHistory.findIndex(
          (p) => p.id === id
        );
        if (historyIndex !== -1) {
          deletedRecord = mockData.priorityHistory.splice(historyIndex, 1)[0];
        }
        break;
    }

    if (!deletedRecord) {
      throw new Error(`${resource} with id ${id} not found`);
    }

    return { data: deletedRecord };
  },

  getMany: async ({ resource, ids, meta }) => {
    await simulateDelay(300);

    let data: any[] = [];

    switch (resource) {
      case "projects":
        data = mockData.projects.filter((p) => ids.includes(p.id));
        break;
      case "clients":
        data = mockData.clients.filter((c) => ids.includes(c.id));
        break;
      case "deployments":
        data = mockData.deployments.filter((d) => ids.includes(d.id));
        break;
      case "alerts":
        data = mockData.alerts.filter((a) => ids.includes(a.id));
        break;
      case "worker_runs":
        data = mockData.workerRuns.filter((w) => ids.includes(w.id));
        break;
      case "project_priority_history":
        data = mockData.priorityHistory.filter((p) => ids.includes(p.id));
        break;
    }

    return { data };
  },

  // Custom method for dashboard stats
  custom: async ({ url, method, payload, query, headers }) => {
    await simulateDelay();

    // Handle custom endpoints
    if (url.includes("/stats") || url.includes("/dashboard")) {
      return { data: getDemoStats() };
    }

    if (url.includes("/projects") && url.includes("/deployments")) {
      const projectId = url.split("/")[2]; // Extract project ID from URL
      return { data: getDeploymentsByProject(projectId) };
    }

    if (url.includes("/projects") && url.includes("/alerts")) {
      const projectId = url.split("/")[2]; // Extract project ID from URL
      return { data: getAlertsByProject(projectId) };
    }

    if (url.includes("/clients") && url.includes("/projects")) {
      const clientId = url.split("/")[2]; // Extract client ID from URL
      return { data: getProjectsByClient(clientId) };
    }

    if (url.includes("/active-alerts")) {
      return { data: getActiveAlerts() };
    }

    if (url.includes("/worker-runs")) {
      const limit = query?.limit ? parseInt(query.limit) : 10;
      return { data: getRecentWorkerRuns(limit) };
    }

    if (url.includes("/priority-history")) {
      const projectId =
        query?.project_id ||
        url.split("/").find((segment) => segment.startsWith("project-"));
      if (projectId) {
        return { data: getPriorityHistoryByProject(projectId) };
      }
      return { data: mockData.priorityHistory };
    }

    // Default response for unknown custom endpoints
    return { data: [] };
  },
};

export default mockDataProvider;
