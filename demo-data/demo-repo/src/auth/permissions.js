export function canExportOrders(user) {
  return Boolean(user?.sellerId && user?.permissions?.includes('orders:export'))
}

