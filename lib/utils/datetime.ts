export const getDatetime = (date: Date, timeZone: 'Asia/Shanghai' | 'America/New_York' = 'Asia/Shanghai') => {
  return date.toLocaleString('sv-SE', { timeZone, hour12: false });
};

export const getWeekday = (date: Date, timeZone: 'Asia/Shanghai' | 'America/New_York' = 'Asia/Shanghai') => {
  switch (formatters[timeZone].format(date)) {
    case 'Monday':
      return 1;
    case 'Tuesday':
      return 2;
    case 'Wednesday':
      return 3;
    case 'Thursday':
      return 4;
    case 'Friday':
      return 5;
    default:
      return 0;
  }
};

const formatters = {
  'Asia/Shanghai': new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Shanghai',
    weekday: 'long',
  }),
  'America/New_York': new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
  }),
};
