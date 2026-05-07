export async function writeExportAuditLog({ actorId, sellerId, dateRange, rowCount }) {
  return {
    event: 'seller_orders_exported',
    actorId,
    sellerId,
    dateRange,
    rowCount,
    createdAt: new Date().toISOString(),
  }
}
