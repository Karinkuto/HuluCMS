import type { Schema, Struct } from '@strapi/strapi';

export interface CartCartItem extends Struct.ComponentSchema {
  collectionName: 'components_cart_items';
  info: {
    description: 'Shopping cart item';
    displayName: 'Cart Item';
  };
  attributes: {
    addedAt: Schema.Attribute.DateTime;
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    variant: Schema.Attribute.Relation<'oneToOne', 'api::variant.variant'>;
  };
}

export interface CommonAddress extends Struct.ComponentSchema {
  collectionName: 'components_common_addresses';
  info: {
    description: 'Shipping and billing addresses';
    displayName: 'Address';
  };
  attributes: {
    city: Schema.Attribute.String & Schema.Attribute.Required;
    country: Schema.Attribute.String & Schema.Attribute.Required;
    phoneNumber: Schema.Attribute.String;
    postalCode: Schema.Attribute.String & Schema.Attribute.Required;
    state: Schema.Attribute.String & Schema.Attribute.Required;
    streetAddress: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OrderOrderItem extends Struct.ComponentSchema {
  collectionName: 'components_order_order_items';
  info: {
    description: 'Individual items within an order';
    displayName: 'Order Item';
  };
  attributes: {
    priceAtTime: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    variant: Schema.Attribute.Relation<'oneToOne', 'api::variant.variant'>;
  };
}

export interface ProductDimensions extends Struct.ComponentSchema {
  collectionName: 'components_product_dimensions';
  info: {
    description: 'Product dimensions with flexible measurements';
    displayName: 'Product Dimensions';
  };
  attributes: {
    customMeasurements: Schema.Attribute.JSON;
    dimensionUnit: Schema.Attribute.Enumeration<['cm', 'in', 'mm', 'm']> &
      Schema.Attribute.DefaultTo<'cm'>;
    measurements: Schema.Attribute.JSON & Schema.Attribute.Required;
    volume: Schema.Attribute.Decimal &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    volumeUnit: Schema.Attribute.Enumeration<['cm3', 'in3', 'm3']> &
      Schema.Attribute.DefaultTo<'cm3'>;
  };
}

export interface ProductDiscount extends Struct.ComponentSchema {
  collectionName: 'components_product_discounts';
  info: {
    description: 'Product discount configuration';
    displayName: 'Product Discount';
  };
  attributes: {
    active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    amount: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    endDate: Schema.Attribute.DateTime;
    startDate: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['percentage', 'fixed']> &
      Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'cart.cart-item': CartCartItem;
      'common.address': CommonAddress;
      'order.order-item': OrderOrderItem;
      'product.dimensions': ProductDimensions;
      'product.discount': ProductDiscount;
    }
  }
}
