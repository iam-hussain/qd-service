import flatCache from 'flat-cache';

import database from '@/providers/database';

import dateTime from './date-time';

const cache = flatCache.load('orderId');

const getPadded = (value: number) => {
  return value.toString().padStart(4, '0');
};

const generateOrderId = async (slug: string) => {
  const cached = cache.getKey(slug);
  const current = dateTime.getIDFormatDate();
  if (cached) {
    const { count, date } = cached;

    if (current === date) {
      return `${date}-${getPadded(count + 1)}`;
    } else {
      return `${date}-${getPadded(count + 1)}`;
    }
  } else {
    const lastEntry = await database.order.findFirst({
      where: {
        shortId: {
          contains: dateTime.getIDFormatDate(),
        },
        store: {
          slug,
        },
      },
      select: {
        shortId: true,
      },
      orderBy: {
        shortId: 'desc',
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, id] = (lastEntry?.shortId || '').split('-');
    const count = Number(id) || 0;
    cache.setKey(slug, { count, date: current });
    return `${current}-${getPadded(count + 1)}`;
  }
};

const incrementOrderId = (slug: string) => {
  const current = dateTime.getIDFormatDate();
  const cached = cache.getKey(slug);
  cache.setKey(slug, { count: cached.count + 1, date: current });
};

export const idSeries = {
  generateOrderId,
  incrementOrderId,
};
