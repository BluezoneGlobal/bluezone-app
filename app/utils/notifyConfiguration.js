const NOTYFY_BY_TIMES_OPEN = 'timesOpen'; // Create after times the application is opened
const NOTYFY_BY_NUMBER_DAY = 'numberDay'; // Create sau số ngày, tại thời điểm nào trong ngày
const NOTYFY_BY_DATETIME = 'datetime';  // Create timestamp

const typeDisplaySystem = 'notify';
const typeDisplayModal = 'modal';

const CONFIG_NOTIFY_TYPES = {
  NOTYFY_BY_TIMES_OPEN,
  NOTYFY_BY_NUMBER_DAY,
  NOTYFY_BY_DATETIME,
};

const NOTIFY_INVITE_NUMBER = 112;

const hasModalNotify = (notify, timesOpenApp, firstTimeOpen) => {
  if (notify.typeDisplay !== typeDisplayModal) {
    return;
  }
  if (notify.type === CONFIG_NOTIFY_TYPES.NOTYFY_BY_TIMES_OPEN) {
    if (timesOpenApp === notify.times) {
      // Modal PopUp
      return true;
    }
  } else if (notify.type === CONFIG_NOTIFY_TYPES.NOTYFY_BY_NUMBER_DAY) {
    const n = Math.floor((new Date().getTime() - firstTimeOpen) / 86400);
    if (n === notify.numberDay) {
      return true;
    }
  } else if (notify.type === CONFIG_NOTIFY_TYPES.NOTYFY_BY_DATETIME) {
    // Xem start day cua 2 cai co bang nhau khong
    if (getStartDay(new Date().getTime()) === getStartDay(notify.datetime)) {
      return true;
    }
  }
  return;
};

const getStartDay = timestamp => {
  return new Date(timestamp).setHours(0, 0, 0, 0);
};

const hasNotifySystem = (notify, firstTimeOpen) => {
  // Xem xét việc tạo notify
  const nowDate = new Date();
  const nowTimestamp = nowDate.getTime();
  if (notify.typeDisplay !== typeDisplaySystem) {
    return 0;
  }
  if (
    (notify.type === NOTYFY_BY_NUMBER_DAY ||
      notify.type === NOTYFY_BY_DATETIME) &&
    notify.typeDisplay === typeDisplaySystem
  ) {
    const startDayFirst = getStartDay(firstTimeOpen);
    if (notify.type === NOTYFY_BY_NUMBER_DAY) {
      if (
        typeof notify.numberDay !== 'number' ||
        typeof notify.time !== 'number' ||
        notify.numberDay < 0 ||
        notify.time < 0
      ) {
        return;
      }

      const yc = startDayFirst + notify.numberDay * 86400000 + notify.time;
      if (nowTimestamp < yc) {
        return yc;
      }
    }
    if (notify.type === NOTYFY_BY_DATETIME) {
      if (nowTimestamp < notify.datetime) {
        return notify.datetime;
      }
    }
  }

  return 0;
};

export {
  CONFIG_NOTIFY_TYPES,
  NOTIFY_INVITE_NUMBER,
  hasModalNotify,
  hasNotifySystem,
};
