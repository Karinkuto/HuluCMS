module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/cart/add',
      handler: 'cart.addItem',
      config: {
        policies: ['is-authenticated'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/cart/remove',
      handler: 'cart.removeItem',
      config: {
        policies: ['is-authenticated'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/cart/update-quantity',
      handler: 'cart.updateQuantity',
      config: {
        policies: ['is-authenticated'],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/cart',
      handler: 'cart.getCart',
      config: {
        policies: ['is-authenticated'],
        middlewares: [],
      },
    },
  ],
}; 