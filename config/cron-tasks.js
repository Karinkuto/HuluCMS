module.exports = {
  '0 0 * * *': { // Run daily at midnight
    task: async () => {
      await strapi.service('api::cart.cart-cleanup').cleanupAbandonedCarts();
      await strapi.service('api::inventory.stock-notification').checkLowStock();
    },
    options: {
      tz: 'UTC'
    }
  }
}; 