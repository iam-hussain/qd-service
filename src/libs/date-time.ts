import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Kolkata');

export const getDate = (date: string | Date = new Date()) => {
  return moment(date).utc().toDate();
};

export const getDateTimeFormat = (date: string | Date) => {
  return moment(date).format('LLL');
};

export const getDateFormat = (date: string | Date) => {
  return moment(date).format('LL');
};

export const getIDFormatDate = () => {
  return moment().format('YYMMDD');
};

export const getTodayStart = (date: string | Date = new Date()) => {
  return moment(date).startOf('day').utc().toDate();
};
export const getTodayEnd = (date: string | Date = new Date()) => {
  return moment(date).endOf('day').utc().toDate();
};

export default {
  getDate,
  getDateFormat,
  getDateTimeFormat,
  getIDFormatDate,
  getTodayStart,
  getTodayEnd,
};
