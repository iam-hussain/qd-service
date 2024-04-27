import { getGroupedItems, ItemCreateSchemaType } from '@iam-hussain/qd-copilot';
import { Item, PRODUCT_TYPE } from '@prisma/client';

import dateTime from '@/libs/date-time';

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
  };
};

const getItemTypeDivided = (items: Item[]) => {
  const drafted = items.filter((e) => e.status === 'DRAFT');
  const nonDraft = items.filter((e) => e.status !== 'DRAFT');
  return {
    items,
    drafted,
    summary: getGroupedItems(nonDraft),
    scheduled: nonDraft.filter((e) => dateTime.isAfterDate(e.placeAt)),
    placed: nonDraft.filter((e) => e.placedAt && dateTime.isBeforeDate(e.placedAt)),
    accepted: nonDraft.filter((e) => e.acceptedAt && dateTime.isBeforeDate(e.acceptedAt)),
    prepared: nonDraft.filter((e) => e.prepared && dateTime.isBeforeDate(e.prepared)),
  };
};

// const groupItems = (input: Item[]) => {
//   const productMap = new M
// };

export const itemTransformer = {
  getCreateItemData,
  getItemTypeDivided,
};
