'use strict';

module.exports = {
  async updateStock(ctx) {
    const { variantId } = ctx.params;
    const { stock } = ctx.request.body;

    try {
      const variant = await strapi.entityService.update('api::variant.variant', variantId, {
        data: { stock }
      });

      return variant;
    } catch (err) {
      return ctx.badRequest('Failed to update stock');
    }
  },

  async reserveStock(ctx) {
    const { variantId } = ctx.params;
    const { quantity } = ctx.request.body;

    try {
      const variant = await strapi.entityService.findOne('api::variant.variant', variantId);
      
      if (!variant || variant.stock < quantity) {
        return ctx.badRequest('Insufficient stock');
      }

      const updatedVariant = await strapi.entityService.update('api::variant.variant', variantId, {
        data: { 
          stock: variant.stock - quantity,
          reserved: (variant.reserved || 0) + quantity
        }
      });

      return updatedVariant;
    } catch (err) {
      return ctx.badRequest('Failed to reserve stock');
    }
  },

  async releaseStock(ctx) {
    const { variantId } = ctx.params;
    const { quantity } = ctx.request.body;

    try {
      const variant = await strapi.entityService.findOne('api::variant.variant', variantId);
      
      if (!variant || (variant.reserved || 0) < quantity) {
        return ctx.badRequest('Invalid release quantity');
      }

      const updatedVariant = await strapi.entityService.update('api::variant.variant', variantId, {
        data: { 
          stock: variant.stock + quantity,
          reserved: variant.reserved - quantity
        }
      });

      return updatedVariant;
    } catch (err) {
      return ctx.badRequest('Failed to release stock');
    }
  },

  async getLowStock(ctx) {
    const { threshold = 10 } = ctx.query;

    try {
      const lowStockVariants = await strapi.db.query('api::variant.variant').findMany({
        where: {
          stock: {
            $lte: threshold
          }
        },
        populate: ['product']
      });

      return lowStockVariants;
    } catch (err) {
      return ctx.badRequest('Failed to fetch low stock items');
    }
  }
}; 