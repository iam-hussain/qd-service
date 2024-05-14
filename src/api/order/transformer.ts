import { OrderUpsertSchemaType } from '@iam-hussain/qd-copilot';
import { Item, Order } from '@prisma/client';

import dateTime from '@/libs/date-time';

import { itemTransformer } from '../item/transformer';
import { storeTransformer } from '../store/transformer';

const getOrderUpsert = (data: OrderUpsertSchemaType, returnDefault: boolean = false) => {
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

const getOrder = (input: (Order & { items: Item[] }) | null) => {
  if (!input) {
    return {};
  }
  return {
    ...input,
    ...itemTransformer.getItemTypeDivided(input?.items || []),
  };
};

const getKitchenOrders = (input: (Order & { items: Item[] })[]) => {
  let items: Item[] = [];
  input.forEach((each) => {
    items = [...items, ...each.items.map((e) => ({ ...e, orderShortId: each.shortId }))];
  });
  return {
    orders: input.map(getOrder),
    items: itemTransformer.getItemTypeDivided(items),
  };
};

export const orderTransformer = {
  getOrderUpsert,
  getOrder,
  getKitchenOrders,
};
