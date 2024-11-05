module.exports = {
  async cleanupAbandonedCarts() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await strapi.db.query('api::cart.cart').updateMany({
      where: {
        status: 'active',
        updatedAt: {
          $lt: thirtyDaysAgo
        }
      },
      data: {
        status: 'abandoned'
      }
    });
  }
}; 