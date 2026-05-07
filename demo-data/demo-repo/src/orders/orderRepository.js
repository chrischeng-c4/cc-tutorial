export async function findOrdersForSeller({ sellerId, dateRange, limit }) {
  return sampleOrders
    .filter(order => order.sellerId === sellerId)
    .filter(order => order.paidAt >= dateRange.start && order.paidAt <= dateRange.end)
    .slice(0, limit)
}

const sampleOrders = [
  {
    id: 'ORD-1001',
    sellerId: 'seller_123',
    status: 'paid',
    paidAt: '2026-04-02T10:20:00Z',
    currency: 'USD',
    grossAmount: '120.00',
    refundAmount: '0.00',
    buyerEmail: 'buyer-a@example.com',
  },
  {
    id: 'ORD-1002',
    sellerId: 'seller_123',
    status: 'refunded',
    paidAt: '2026-04-04T15:45:00Z',
    currency: 'USD',
    grossAmount: '85.00',
    refundAmount: '85.00',
    buyerEmail: 'buyer-b@example.com',
  },
  {
    id: 'ORD-1003',
    sellerId: 'seller_999',
    status: 'paid',
    paidAt: '2026-04-05T08:10:00Z',
    currency: 'USD',
    grossAmount: '42.00',
    refundAmount: '0.00',
    buyerEmail: 'other-seller@example.com',
  },
]

