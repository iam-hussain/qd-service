import { getGroupedItems, ItemCreateSchemaType, ItemUpdateSchemaType } from '@iam-hussain/qd-copilot';
import { Item, ITEM_STATUS, PRODUCT_TYPE } from '@prisma/client';
import _ from 'lodash';

import dateTime from '@/libs/date-time';

const getConnectItemData = (input: ItemCreateSchemaType, userId: string) => {
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
    placeAt: dateTime.getDate(),
    placedAt: dateTime.getDate(),
    status: input.status || 'DRAFT',
    ...(input?.kitchenCategoryId
      ? {
          kitchenCategory: {
            connect: {
              id: input.kitchenCategoryId,
            },
          },
        }
      : {}),
  };
};

const getCreateItemData = (input: ItemCreateSchemaType, orderId: string, userId: string) => {
  return {
    productId: input.productId,
    title: input.title || '',
    note: input.note || '',
    type: (input.type as any) || PRODUCT_TYPE.NON_VEG,
    quantity: Number(input.quantity) || 1,
    position: Number(input.position) || 0,
    price: Number(input.price) || 0,
    total: Number(input.price) * (Number(input.quantity) || 1),
    placeAt: dateTime.getDate(),
    placedAt: dateTime.getDate(),
    orderId: orderId,
    createdId: userId,
    status: input.status || 'DRAFT',
    ...(input?.kitchenCategoryId
      ? {
          kitchenCategory: {
            connect: {
              id: input.kitchenCategoryId,
            },
          },
        }
      : {}),
  };
};

const getItemTypeDivided = (input: Item[]) => {
  const items = _.sortBy(input, 'createdAt');
  const drafted = items.filter((e) => e.status === 'DRAFT');
  const nonDraft = items.filter((e) => e.status !== 'DRAFT');
  return {
    all: items,
    items: nonDraft,
    drafted,
    summary: getGroupedItems(nonDraft),
    scheduled: nonDraft.filter((e) => e.status === ITEM_STATUS.SCHEDULED && dateTime.isAfterDate(e.placeAt)),
    placed: nonDraft.filter((e) => e.status === ITEM_STATUS.PLACED && e.placedAt && dateTime.isBeforeDate(e.placedAt)),
    accepted: nonDraft.filter(
      (e) => e.status === ITEM_STATUS.ACCEPTED && e.acceptedAt && dateTime.isBeforeDate(e.acceptedAt)
    ),
    prepared: nonDraft.filter(
      (e) => e.status === ITEM_STATUS.PREPARED && e.preparedAt && dateTime.isBeforeDate(e.preparedAt)
    ),
  };
};

const getUpdateItemData = (data: ItemUpdateSchemaType, userId: string) => {
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
    'status',
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
  getConnectItemData,
  getCreateItemData,
  getItemTypeDivided,
  getUpdateItemData,
};
