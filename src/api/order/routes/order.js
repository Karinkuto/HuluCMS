module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/orders/create',
      handler: 'order.create',
      config: {
        policies: ['is-authenticated'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/orders/:id/status',
      handler: 'order.updateStatus',
      config: {
        policies: ['is-admin'],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/orders/customer/:customerId',
      handler: 'order.customerOrders',
      config: {
        policies: ['is-owner-or-admin'],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/orders/:id/tracking',
      handler: 'order.getTracking',
      config: {
        policies: ['is-owner-or-admin'],
        middlewares: [],
      },
    },
  ],
}; 