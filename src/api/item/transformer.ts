import { getGroupedItems, ItemCreateSchemaType, ItemUpdateSchemaType } from '@iam-hussain/qd-copilot';
import { Item, PRODUCT_TYPE } from '@prisma/client';
import _ from 'lodash';

import dateTime from '@/libs/date-time';

const createConnectItem = (
  input: ItemCreateSchemaType & {
    placedAt?: string;
    scheduledAt?: string;
  },
  userId: string
) => {
  return {
    product: {
      connect: {
        id: input.productId,
      },
    },
    createdBy: {
      connect: {
        id: userId,
      },
    },
    title: input.title || '',
    note: input.note || '',
    type: (input.type as any) || PRODUCT_TYPE.NON_VEG,
    quantity: Number(input.quantity) || 1,
    position: Number(input.position) || 0,
    price: Number(input.price) || 0,
    total: Number(input.price) * (Number(input.quantity) || 1),
    ...(input.placedAt ? { placedAt: input.placedAt } : {}),
    ...(input.scheduledAt ? { scheduledAt: input.scheduledAt } : {}),
  };
};

const createItem = (
  input: ItemCreateSchemaType & {
    placedAt?: string;
    scheduledAt?: string;
  },
  orderId: string,
  userId: string
) => {
  return {
    productId: input.productId,
    title: input.title || '',
    note: input.note || '',
    type: (input.type as any) || PRODUCT_TYPE.NON_VEG,
    quantity: Number(input.quantity) || 1,
    position: Number(input.position) || 0,
    price: Number(input.price) || 0,
    total: Number(input.price) * (Number(input.quantity) || 1),
    placedAt: input?.placedAt || dateTime.getDate(),
    ...(input.scheduledAt ? { scheduledAt: input.scheduledAt } : {}),
    orderId: orderId,
    createdId: userId,
  };
};

const item = (input: Item) => {
  const item = _.pick(input, [
    'id',
    'title',
    'type',
    'price',
    'quantity',
    'total',
    'position',
    'placedAt',
    'acceptedAt',
    'completedAt',
    'scheduledAt',
    'rejectedAt',
    'rejected',
  ]);
  return {
    ...item,
    scheduledInMin: dateTime.diffInMinutes(item.scheduledAt, item.placedAt) || 0,
  };
};

const sortItems = (input: Item[]) => {
  // Sort items by 'position' property
  const sortedItems = _.sortBy(input.map(item), 'position');

  // Filter items into drafted and non-drafted categories
  const draftedItems = sortedItems.filter((item) => !item.placedAt);
  const rejectedItems = sortedItems.filter((item) => item.rejectedAt && item.rejected);
  const validItems = sortedItems.filter((item) => Boolean(item.placedAt) && !item.rejected && !item.rejectedAt);

  return {
    // all: sortedItems,
    drafted: draftedItems,
    rejected: rejectedItems,
    valid: validItems,
    summary: getGroupedItems(validItems),
    scheduled: validItems.filter(
      (item) => Boolean(item.scheduledAt) && item.placedAt && dateTime.isAfterDate(item.placedAt)
    ),
    placed: validItems.filter(
      (item) => item.placedAt && !item.acceptedAt && !item.completedAt && dateTime.isBeforeDate(item.placedAt)
    ),
    accepted: validItems.filter((item) => item.acceptedAt && dateTime.isBeforeDate(item.acceptedAt)),
    completed: validItems.filter((item) => item.completedAt && dateTime.isBeforeDate(item.completedAt)),
  };
};

const updateItem = (data: ItemUpdateSchemaType, userId: string) => {
  const output = _.pick(data, [
    'id',
    'title',
    'note',
    'type',
    'price',
    'quantity',
    'total',
    'position',
    'placeAt',
    'placedAt',
    'acceptedAt',
    'preparedAt',
    'billId',
  ]);

  return {
    ...output,
    updatedBy: {
      connect: {
        id: userId,
      },
    },
  };
};

export const itemTransformer = {
  item,
  createConnectItem,
  createItem,
  sortItems,
  updateItem,
};
