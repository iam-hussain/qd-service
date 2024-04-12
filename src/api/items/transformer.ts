import { ItemCreateSchemaType } from '@iam-hussain/qd-copilot';
import { PRODUCT_TYPE } from '@prisma/client';

import dateTime from '@/libs/date-time';

const getItems = (input: ItemCreateSchemaType, orderId: string, userId: string) => {
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
    // createdBy: {
    //   connect: {
    //     id: userId,
    //   },
    // },
  };
};

// const groupItems = (input: Item[]) => {
//   const productMap = new M
// };

export const itemTransformer = {
  getItems,
};
