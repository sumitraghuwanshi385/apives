import { ApiListing, AnalyticsData } from '../types';

const recentDate = new Date();
const pastDate = new Date();
pastDate.setDate(pastDate.getDate() - 45);

export const BASE_MOCK_APIS: ApiListing[] = [
  {
    id: 'api-0',
    name: 'Aadhaar Bridge',
    provider: 'DigiLocker Auth',
    description: 'Enterprise-grade identity verification protocol providing secure Aadhaar OTP and biometric authentication. Fully compliant with UIDAI standards and DPDP regulations.',
    category: 'Identity',
    pricing: { type: 'Freemium', pricePerCall: 0.45, currency: 'INR', details: 'First 500 KYC checks free monthly' },
    upvotes: 2450,
    saves: 812,
    latency: 'Low',
    stability: 'Stable',
    accessType: 'Auth required',
    uptime: 99.99,
    imageUrl: '',
    gallery: [],
    features: ['Biometric Verification', 'OTP-based e-KYC', 'Secure XML Data Vault', 'Real-time Audit Logs'],
    externalUrl: 'https://docs.digilocker.gov.in',
    publishedAt: recentDate.toISOString(),
    tags: ['KYC', 'Aadhaar', 'Government', 'Identity'],
    endpoints: [
      {
        method: 'POST',
        path: '/v1/auth/otp/send',
        description: 'Initiate an OTP request to the registered mobile number associated with the Aadhaar.',
        body: { aadhaar_number: 'XXXX-XXXX-1234' },
        responseExample: { txn_id: 'TXN-98234-A', status: 'OTP_SENT', timestamp: '2024-03-20T10:00:00Z' }
      }
    ],
    status: 'active'
  },
  {
    id: 'api-1',
    name: 'UPI DeepLink',
    provider: 'NPCI Partner Hub',
    description: 'Programmable payment interface for generating dynamic UPI QR codes and intent links. Includes real-time webhook notifications for settlement confirmation.',
    category: 'Payments',
    pricing: { type: 'Paid', pricePerCall: 1.25, currency: 'INR', details: 'Transaction based billing' },
    upvotes: 3820,
    saves: 1540,
    latency: 'Medium',
    stability: 'Stable',
    accessType: 'Partner only',
    uptime: 99.95,
    imageUrl: '',
    gallery: [],
    features: ['Dynamic QR Generation', 'Payment Intent Hooks', 'VPA Validation', 'Settlement Reports'],
    externalUrl: 'https://npci.org.in/developer',
    publishedAt: '2024-01-15',
    tags: ['UPI', 'Payments', 'Banking', 'Fintech'],
    endpoints: [
      {
        method: 'POST',
        path: '/v2/payments/generate-qr',
        description: 'Create a dynamic UPI QR code for a specific transaction amount and merchant account.',
        body: { amount: 1500.00, vpa: 'merchant@upi', order_id: 'ORD-772' },
        responseExample: { qr_string: 'upi://pay?pa=merchant@upi&am=1500&tr=ORD-772', short_url: 'https://pay.link/abc' }
      }
    ],
    status: 'active'
  },
  {
    id: 'api-2',
    name: 'LogiTrack India',
    provider: 'ShipMatrix Solutions',
    description: 'Unified logistics aggregation API supporting real-time tracking across 60+ Indian courier services. Automated status mapping and delivery prediction engine.',
    category: 'Infrastructure',
    pricing: { type: 'Freemium', pricePerCall: 0.15, currency: 'INR', details: 'Tiered pricing based on tracking volume' },
    upvotes: 1120,
    saves: 450,
    latency: 'Low',
    stability: 'Stable',
    accessType: 'Public',
    uptime: 99.90,
    imageUrl: '',
    gallery: [],
    features: ['Multi-carrier Tracking', 'PIN Code Serviceability', 'NDR Management', 'Delivery Prediction'],
    externalUrl: 'https://api.shipmatrix.in',
    publishedAt: pastDate.toISOString(),
    tags: ['Logistics', 'E-commerce', 'Tracking', 'SaaS'],
    endpoints: [
      {
        method: 'GET',
        path: '/v1/track/{awb_number}',
        description: 'Retrieve the latest tracking checkpoints and delivery status for a specific AWB.',
        responseExample: { awb: '109928374', carrier: 'BlueDart', status: 'IN_TRANSIT', location: 'New Delhi HUB' }
      }
    ],
    status: 'active'
  },
  {
    id: 'api-3',
    name: 'GST Insights',
    provider: 'TaxLogic Systems',
    description: 'Comprehensive GSTIN verification and filing history tool. Enables bulk validation of tax identities and return filing compliance scoring.',
    category: 'Data',
    pricing: { type: 'Paid', pricePerCall: 2.50, currency: 'INR', details: 'Enterprise SLA available' },
    upvotes: 940,
    saves: 310,
    latency: 'Medium',
    stability: 'Beta',
    accessType: 'Auth required',
    uptime: 99.85,
    imageUrl: '',
    gallery: [],
    features: ['GSTIN Search', 'Return Filing Status', 'Compliance Score', 'GSTR-1/3B History'],
    externalUrl: 'https://taxlogic.io/api',
    publishedAt: recentDate.toISOString(),
    tags: ['GST', 'Compliance', 'Tax', 'Legal'],
    endpoints: [
      {
        method: 'GET',
        path: '/v1/gstin/search',
        description: 'Look up active GST registration details and filing status for a specific GSTIN.',
        body: { gstin: '07AAAAA0000A1Z5' },
        responseExample: { legal_name: 'Tech Solutions Ltd', status: 'Active', compliance_score: 98.5 }
      }
    ],
    status: 'active'
  }
];

// Mapping to ensure only unique refined items are used
export const MOCK_APIS: ApiListing[] = BASE_MOCK_APIS;

export const getAllApis = (includePaused: boolean = false): ApiListing[] => {
  const localApis = JSON.parse(localStorage.getItem('mora_local_apis') || '[]');
  const deletedIds = JSON.parse(localStorage.getItem('mora_deleted_node_ids') || '[]');
  const mockStatuses = JSON.parse(localStorage.getItem('mora_mock_statuses') || '{}');

  const processedMockApis = MOCK_APIS.map(api => ({
    ...api,
    status: mockStatuses[api.id] || api.status || 'active'
  }));

  const all = [...localApis, ...processedMockApis].filter(api => !deletedIds.includes(api.id));
  
  if (includePaused) return all;
  return all.filter(api => api.status === 'active');
};

export const MOCK_ANALYTICS: AnalyticsData[] = [
  { date: 'Mon', requests: 4200, errors: 12, latency: 45 },
  { date: 'Tue', requests: 5100, errors: 8, latency: 42 },
  { date: 'Wed', requests: 4800, errors: 15, latency: 48 },
  { date: 'Thu', requests: 6200, errors: 22, latency: 44 },
  { date: 'Fri', requests: 5900, errors: 10, latency: 41 },
  { date: 'Sat', requests: 3100, errors: 5, latency: 38 },
  { date: 'Sun', requests: 2800, errors: 3, latency: 37 },
];