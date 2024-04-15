import { Category, Product, PRODUCT_TYPE } from '@prisma/client';
import _ from 'lodash';

import dateTime from '@/libs/date-time';
import { imageTransformer } from '@/models/image-transformer';

const typeMap: { [key in PRODUCT_TYPE]: string } = {
  VEG: 'Veg',
  NON_VEG: 'Non-veg',
  VEGAN: 'Vegan',
};

const productTable = (
  product: Product & {
    category?: Partial<Category> | null;
  }
) => {
  const picked = _.pick(product, ['id', 'shortId', 'name', 'deck', 'price', 'outOfStock', 'type']);

  return {
    ...picked,
    formattedPrice: product.price.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
    }),
    image: imageTransformer.images(product.images),
    foodType: typeMap[product.type],
    categoryName: product?.category?.name,
    categoryId: product?.categoryId || product?.category?.id,
    createdAt: dateTime.getDate(product.createdAt),
    createdDate: dateTime.getDateFormat(product.createdAt),
    createdDateTime: dateTime.getDateTimeFormat(product.createdAt),
    updatedAt: dateTime.getDate(product.updatedAt),
    updatedDate: dateTime.getDateFormat(product.updatedAt),
    updatedDateTime: dateTime.getDateTimeFormat(product.updatedAt),
  };
};
const products = (
  products: (Product & {
    category?: Partial<Category> | null;
  })[]
) => {
  return products.map(productTable);
};

export const productTransformer = {
  product: productTable,
  products,
};
