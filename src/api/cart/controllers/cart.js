'use strict';

module.exports = {
  async addItem(ctx) {
    const { variantId, quantity } = ctx.request.body;
    const userId = ctx.state.user.id;

    try {
      // Check if variant exists and has enough stock
      const variant = await strapi.entityService.findOne('api::variant.variant', variantId);
      if (!variant || variant.stock < quantity) {
        return ctx.badRequest('Invalid variant or insufficient stock');
      }

      // Get or create cart for user
      let cart = await strapi.db.query('api::cart.cart').findOne({
        where: { user: userId, status: 'active' }
      });

      if (!cart) {
        cart = await strapi.entityService.create('api::cart.cart', {
          data: {
            user: userId,
            status: 'active',
            items: []
          }
        });
      }

      // Add or update item in cart
      const existingItem = cart.items.find(item => item.variant.id === variantId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ variant: variantId, quantity });
      }

      // Update cart
      const updatedCart = await strapi.entityService.update('api::cart.cart', cart.id, {
        data: { items: cart.items }
      });

      return updatedCart;
    } catch (err) {
      return ctx.badRequest('Failed to add item to cart');
    }
  },

  async removeItem(ctx) {
    const { variantId } = ctx.request.body;
    const userId = ctx.state.user.id;

    try {
      const cart = await strapi.db.query('api::cart.cart').findOne({
        where: { user: userId, status: 'active' }
      });

      if (!cart) {
        return ctx.notFound('Cart not found');
      }

      cart.items = cart.items.filter(item => item.variant.id !== variantId);

      const updatedCart = await strapi.entityService.update('api::cart.cart', cart.id, {
        data: { items: cart.items }
      });

      return updatedCart;
    } catch (err) {
      return ctx.badRequest('Failed to remove item from cart');
    }
  },

  async updateQuantity(ctx) {
    const { variantId, quantity } = ctx.request.body;
    const userId = ctx.state.user.id;

    try {
      const cart = await strapi.db.query('api::cart.cart').findOne({
        where: { user: userId, status: 'active' }
      });

      if (!cart) {
        return ctx.notFound('Cart not found');
      }

      const item = cart.items.find(item => item.variant.id === variantId);
      if (!item) {
        return ctx.notFound('Item not found in cart');
      }

      // Check stock availability
      const variant = await strapi.entityService.findOne('api::variant.variant', variantId);
      if (variant.stock < quantity) {
        return ctx.badRequest('Insufficient stock');
      }

      item.quantity = quantity;

      const updatedCart = await strapi.entityService.update('api::cart.cart', cart.id, {
        data: { items: cart.items }
      });

      return updatedCart;
    } catch (err) {
      return ctx.badRequest('Failed to update quantity');
    }
  },

  async getCart(ctx) {
    const userId = ctx.state.user.id;

    try {
      const cart = await strapi.db.query('api::cart.cart').findOne({
        where: { user: userId, status: 'active' },
        populate: {
          items: {
            populate: ['variant']
          }
        }
      });

      return cart || { items: [] };
    } catch (err) {
      return ctx.badRequest('Failed to fetch cart');
    }
  }
}; 