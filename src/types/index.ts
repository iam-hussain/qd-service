import { FeatureFlagsType } from '@iam-hussain/qd-copilot';

export type JWT_OBJECT = {
  user: {
    id: string;
    shortId: string;
    type: 'CUSTOMER' | 'SELLER';
  };
  stores: { slug: string; id: string; shortId: string }[];
  store: { slug: string; id: string; shortId: string };
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

export type RequestContext = {
  tokenExist: boolean;
  authenticated: boolean;
  user: {
    id: string;
    shortId: string;
    type: 'CUSTOMER' | 'SELLER';
  };
  stores: { slug: string; id: string; shortId: string }[];
  store: { slug: string; id: string; shortId: string };
  featureFlags: FeatureFlagsType;
};
