const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeader = () => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth-token='))
    ?.split('=')[1];

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const api = {
  // Orders
  getOrders: async () => {
    const response = await fetch(`${API_URL}/main/api/orders/`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  getOrder: async (id: string) => {
    const response = await fetch(`${API_URL}/main/api/orders/${id}/`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_URL}/main/api/orders/${id}/update_status/`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  },

  acceptBid: async (orderId: string, bidId: string) => {
    const response = await fetch(`${API_URL}/main/api/orders/${orderId}/accept_bid/`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ bid_id: bidId }),
    });
    if (!response.ok) throw new Error('Failed to accept bid');
    return response.json();
  },

  // Bids
  getBids: async () => {
    const response = await fetch(`${API_URL}/main/api/bids/`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to fetch bids');
    return response.json();
  },

  createBid: async (bidData: any) => {
    const response = await fetch(`${API_URL}/main/api/bids/`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(bidData),
    });
    if (!response.ok) throw new Error('Failed to create bid');
    return response.json();
  },

  rejectBid: async (bidId: string) => {
    const response = await fetch(`${API_URL}/main/api/bids/${bidId}/reject/`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to reject bid');
    return response.json();
  },

  createOrder: async (bidId: string, price: string) => {
    const response = await fetch(`${API_URL}/main/api/orders/`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        bid_id: bidId,
        total_price: price,
      }),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },
}; 