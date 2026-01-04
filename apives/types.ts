export interface ApiListing {
  id: string;
  name: string;
  provider: string;
  description: string;
  category: 'Identity' | 'Payments' | 'AI' | 'Data' | 'Messaging' | 'Infrastructure' | string;
  pricing: {
    type: 'Free' | 'Freemium' | 'Paid';
    pricePerCall?: number; // In INR
    currency: string;
    details?: string; // Custom pricing description
  };
  upvotes: number;
  saves: number;
  latency: string;
  stability: 'Stable' | 'Beta' | 'Experimental' | string;
  accessType: 'Public' | 'Auth required' | 'Partner only' | string;
  uptime: number;
  imageUrl: string;
  gallery?: string[];
  features?: string[];
  externalUrl: string;
  publishedAt: string;
  endpoints: Endpoint[];
  tags: string[];
  status?: 'active' | 'paused';
}

export interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  headers?: Record<string, string>;
  body?: Record<string, any>;
  responseExample: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  apiKeys: string[];
  subscriptions: string[];
  bookmarks: string[];
}

export interface AnalyticsData {
  date: string;
  requests: number;
  errors: number;
  latency: number;
}