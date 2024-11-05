'use strict';

module.exports = {
  async create(ctx) {
    const { items, shippingAddress, billingAddress } = ctx.request.body;
    const userId = ctx.state.user.id;

    try {
      // Validate stock availability and calculate totals
      let subtotal = 0;
      const validatedItems = [];

      for (const item of items) {
        const variant = await strapi.entityService.findOne('api::variant.variant', item.variantId);
        
        if (!variant || variant.stock < item.quantity) {
          return ctx.badRequest(`Insufficient stock for variant ${item.variantId}`);
        }

        const itemTotal = variant.price * item.quantity;
        subtotal += itemTotal;

        validatedItems.push({
          variant: item.variantId,
          quantity: item.quantity,
          priceAtTime: variant.price
        });
      }

      // Calculate tax and shipping (simplified)
      const tax = subtotal * 0.1; // 10% tax
      const shipping = 10; // Flat rate shipping
      const total = subtotal + tax + shipping;

      // Create order
      const order = await strapi.entityService.create('api::order.order', {
        data: {
          customer: userId,
          items: validatedItems,
          subtotal,
          tax,
          shipping,
          total,
          shippingAddress,
          billingAddress,
          status: 'pending',
          paymentStatus: 'pending',
          orderNumber: `ORD-${Date.now()}`
        }
      });

      // Update inventory
      for (const item of validatedItems) {
        await strapi.entityService.update('api::variant.variant', item.variant, {
          data: {
            stock: { $dec: item.quantity }
          }
        });
      }

      return order;
    } catch (err) {
      return ctx.badRequest('Failed to create order');
    }
  },

  async updateStatus(ctx) {
    const { id } = ctx.params;
    const { status, trackingNumber } = ctx.request.body;

    try {
      const order = await strapi.entityService.update('api::order.order', id, {
        data: { 
          status,
          ...(trackingNumber && { trackingNumber })
        }
      });

      return order;
    } catch (err) {
      return ctx.badRequest('Failed to update order status');
    }
  },

  async customerOrders(ctx) {
    const { customerId } = ctx.params;

    try {
      const orders = await strapi.db.query('api::order.order').findMany({
        where: { customer: customerId },
        orderBy: { createdAt: 'DESC' },
        populate: {
          items: {
            populate: ['variant']
          }
        }
      });

      return orders;
    } catch (err) {
      return ctx.badRequest('Failed to fetch customer orders');
    }
  },

  async getTracking(ctx) {
    const { id } = ctx.params;

    try {
      const order = await strapi.entityService.findOne('api::order.order', id, {
        fields: ['trackingNumber', 'status']
      });

      if (!order) {
        return ctx.notFound('Order not found');
      }

      return {
        trackingNumber: order.trackingNumber,
        status: order.status
      };
    } catch (err) {
      return ctx.badRequest('Failed to fetch tracking information');
    }
  }
}; 