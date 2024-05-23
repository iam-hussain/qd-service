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

const item = (input: Item, variant?: string) => {
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
    'createdAt',
    'productId',
  ]);
  return {
    ...item,
    scheduledInMin: dateTime.diffInMinutes(item.scheduledAt, item.placedAt) || 0,
    ...(variant ? { variant } : {}),
  };
};

const items = (input: Item[], variant?: string) => {
  return input.map((e) => item(e, variant));
};

const sortItems = (input: Item[]) => {
  const sortedItems = _.sortBy(input, ['placedAt', 'position']);
  const draftedItems = sortedItems.filter((item) => !item.placedAt);
  const rejectedItems = sortedItems.filter((item) => item.rejectedAt && item.rejected);
  const validItems = sortedItems.filter((item) => Boolean(item.placedAt) && !item.rejected && !item.rejectedAt);
  const scheduledItems = validItems.filter(
    (item) => Boolean(item.scheduledAt) && item.placedAt && dateTime.isAfterDate(item.placedAt)
  );
  const placedItems = validItems.filter(
    (item) => item.placedAt && !item.acceptedAt && !item.completedAt && dateTime.isBeforeDate(item.placedAt)
  );
  const acceptedItems = validItems.filter(
    (item) => item.acceptedAt && !item.completedAt && dateTime.isBeforeDate(item.acceptedAt)
  );
  const completedItems = validItems.filter((item) => item.completedAt && dateTime.isBeforeDate(item.completedAt));

  return {
    // valid: items(draftedItems, 'valid'),
    drafted: items(draftedItems, 'drafted'),
    rejected: items(rejectedItems, 'rejected'),
    scheduled: items(scheduledItems, 'scheduled'),
    placed: items(placedItems, 'placed'),
    accepted: items(acceptedItems, 'accepted'),
    completed: items(completedItems, 'completed'),
    summary: getGroupedItems(validItems),
    validCount: validItems.length,
  };
};

const updateItem = (data: ItemUpdateSchemaType, userId: string) => {
  const output = _.pick(data, [
    'title',
    'note',
    'type',
    'price',
    'quantity',
    'total',
    'position',
    'placedAt',
    'acceptedAt',
    'completedAt',
    'rejectedAt',
    'rejected',
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
  items,
  createConnectItem,
  createItem,
  sortItems,
  updateItem,
};
