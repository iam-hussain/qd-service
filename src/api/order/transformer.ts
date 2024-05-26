import { OrderUpsertSchemaType } from '@iam-hussain/qd-copilot';
import { Item, Order, Token, User } from '@prisma/client';

import dateTime from '@/libs/date-time';

import { itemTransformer } from '../item/transformer';
import { storeTransformer } from '../store/transformer';
import { tokenTransformer } from '../token/transformer';

const getOrderUpsert = (data: Partial<OrderUpsertSchemaType>, returnDefault: boolean = false) => {
  const order: any = {};

  if (data?.type) {
    order.type = data.type;
  }

  if (data?.status) {
    order.status = data.status;
  }

  if (data?.table) {
    order.table = data.table;
  } else if (!data?.table && returnDefault) {
    order.table = '';
  }

  if (data?.note) {
    order.note = data.note;
  } else if (!data?.note && returnDefault) {
    order.note = '';
  }

  if (data?.completedAt) {
    order.completedAt = dateTime.getDate(data.completedAt);
  }

  if (data?.deliveredAt) {
    order.deliveredAt = dateTime.getDate(data.deliveredAt);
  }

  if (data?.taxes && data.taxes.length) {
    order.taxes = data.taxes.map((e) => storeTransformer.getTax(e)).filter(Boolean);
  }

  if (data?.fees && data.fees.length) {
    order.fees = data.fees.map((e) => storeTransformer.getFee(e as any)).filter(Boolean);
  }

  if (data?.table) {
    const tableData = storeTransformer.getTable(data.table);
    if (tableData) {
      order.table = tableData;
    }
  }

  return order;
};

const getOrder = (input: (Order & { items: Item[]; tokens: Token[]; createdBy?: User; updatedBy?: User }) | null) => {
  if (!input) {
    return {};
  }
  const { items, createdBy, updatedBy, tokens, ...data } = input;
  return {
    ...data,
    items: itemTransformer.sortItems(items || []),
    tokens: tokenTransformer.tokens(tokens || [], items || []),
    ...(createdBy ? { createdByName: `${createdBy.firstName || ''} ${createdBy.lastName || ''}`.trim() } : {}),
    ...(updatedBy ? { updatedByName: `${updatedBy.firstName || ''} ${updatedBy.lastName || ''}`.trim() } : {}),
  };
};

const getTableOrder = (
  input: (Order & { items: Item[]; tokens: Token[]; createdBy?: User; updatedBy?: User }) | null
) => {
  if (!input) {
    return {};
  }
  const { createdBy, updatedBy, ...data } = input;
  const items = itemTransformer.sortItems(input.items || []);
  return {
    ...data,
    totalItemsCount: items.validCount,
    acceptedItemsCount: items.accepted.length,
    completedItemsCount: items.completed.length,
    draftedItemsCount: items.drafted.length,
    placedItemsCount: items.placed.length,
    rejectedItemsCount: items.rejected.length,
    scheduledItemsCount: items.scheduled.length,
    ...(createdBy ? { createdByName: `${createdBy.firstName || ''} ${createdBy.lastName || ''}`.trim() } : {}),
    ...(updatedBy ? { updatedByName: `${updatedBy.firstName || ''} ${updatedBy.lastName || ''}`.trim() } : {}),
  };
};

export const orderTransformer = {
  getOrderUpsert,
  getOrder,
  getTableOrder,
};
