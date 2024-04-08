export type JWT_OBJECT = {
  username: string;
  userId: string;
  store: string;
  storeId: string;
  type: 'CUSTOMER' | 'SELLER';
};

export type JWT_DECODE = { data: JWT_OBJECT; iat: number; exp: number };

type CALC_VALUE_TYPE = 'VALUE' | 'PERCENTAGE' | 'VALUE_COUNT';

export type StoreAdditionalType = {
  table: {
    key: string;
    name: string;
    printName: string;
    position: number;
  }[];
  tax: {
    key: string;
    name: string;
    printName: string;
    value: number;
    position: number;
    type: CALC_VALUE_TYPE;
  }[];
  discounts: {
    key: string;
    name: string;
    printName: string;
    value: number;
    type: CALC_VALUE_TYPE;
  }[];
  packing: {
    value: number;
    type: CALC_VALUE_TYPE;
  };
  delivery: {
    value: number;
    type: CALC_VALUE_TYPE;
  };
};

export type CustomRequest = Request & {
  auth: {
    hasToken: boolean;
    isSeller: boolean;
    hasStore: boolean;
    storeId: string;
    userId: string;
  };
};
