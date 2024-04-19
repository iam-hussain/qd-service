import { ItemCreateSchemaType } from '@iam-hussain/qd-copilot';
import { Item, PRODUCT_TYPE } from '@prisma/client';

import dateTime from '@/libs/date-time';

const getEachItem = (input: ItemCreateSchemaType, orderId: string, userId: string) => {
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
  };
};

const getGroupedItems = (items: Item[]): Item[] => {
  const grouped = items.reduce<{ [key in string]: Item }>((obj, item) => {
    if (obj[item.productId]) {
      const data = obj[item.productId];
      obj[item.productId] = {
        ...data,
        quantity: data.quantity + item.quantity,
        price: data.price + item.price,
        total: data.total + item.total,
      };
    } else {
      obj[item.productId] = item;
    }
    return obj;
  }, {});

  return Object.values(grouped);
};

const getItemTypeDivided = (items: Item[]) => {
  return {
    items,
    summaryItems: getGroupedItems(items),
    scheduled: items.filter((e) => dateTime.isAfterDate(e.placeAt)),
    placed: items.filter((e) => e.placedAt && dateTime.isBeforeDate(e.placedAt)),
    accepted: items.filter((e) => e.acceptedAt && dateTime.isBeforeDate(e.acceptedAt)),
    prepared: items.filter((e) => e.prepared && dateTime.isBeforeDate(e.prepared)),
  };
};

// const groupItems = (input: Item[]) => {
//   const productMap = new M
// };

export const itemTransformer = {
  getEachItem,
  getItemTypeDivided,
};
