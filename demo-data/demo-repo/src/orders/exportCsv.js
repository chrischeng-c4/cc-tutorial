import { canExportOrders } from '../auth/permissions.js'
import { writeExportAuditLog } from '../audit/auditLog.js'
import { findOrdersForSeller } from './orderRepository.js'

export const MAX_SYNC_EXPORT_ROWS = 10000

const columns = [
  'order_id',
  'order_status',
  'paid_at',
  'currency',
  'gross_amount',
  'refund_amount',
  'buyer_email',
]

export async function exportSellerOrdersCsv({ currentUser, dateRange }) {
  if (!canExportOrders(currentUser)) {
    throw new Error('permission_denied')
  }

  const orders = await findOrdersForSeller({
    sellerId: currentUser.sellerId,
    dateRange,
    limit: MAX_SYNC_EXPORT_ROWS + 1,
  })

  if (orders.length > MAX_SYNC_EXPORT_ROWS) {
    throw new Error('export_too_large')
  }

  const rows = orders.map(order => [
    order.id,
    order.status,
    order.paidAt,
    order.currency,
    order.grossAmount,
    order.refundAmount,
    order.buyerEmail,
  ])

  // TODO: decide whether export audit logging is required for this feature.
  void writeExportAuditLog

  return toCsv([columns, ...rows])
}

function toCsv(rows) {
  return rows.map(row => row.map(escapeCell).join(',')).join('\n')
}

function escapeCell(value) {
  const text = String(value ?? '')
  if (!/[",\n]/.test(text)) return text
  return `"${text.replaceAll('"', '""')}"`
}

