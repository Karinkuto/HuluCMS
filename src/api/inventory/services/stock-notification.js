module.exports = {
  async checkLowStock() {
    const lowStockItems = await strapi.service('api::inventory.inventory').getLowStock();
    
    if (lowStockItems.length > 0) {
      // Implement notification logic (email, webhook, etc.)
      await strapi.plugins['email'].services.email.send({
        to: 'admin@example.com',
        subject: 'Low Stock Alert',
        text: `The following items are low in stock: ${lowStockItems.map(item => item.sku).join(', ')}`
      });
    }
  }
}; 