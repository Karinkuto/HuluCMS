module.exports = {
  routes: [
    {
      method: 'PUT',
      path: '/inventory/:variantId',
      handler: 'inventory.updateStock',
      config: {
        policies: ['is-admin'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/inventory/:variantId/reserve',
      handler: 'inventory.reserveStock',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/inventory/:variantId/release',
      handler: 'inventory.releaseStock',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/inventory/low-stock',
      handler: 'inventory.getLowStock',
      config: {
        policies: ['is-admin'],
        middlewares: [],
      },
    },
  ],
}; 