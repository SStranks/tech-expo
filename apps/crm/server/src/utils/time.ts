/**
 * @param {number} hours
 * @returns {number} Seconds from epoch
 */
const hoursFromNowInEpochSeconds = (hours: number): number => {
  if (hours < 0) throw new Error('Hours must be greater than zero');
  return Date.now() + hours * 60 * 60 * 1000;
};

/**
 * @param {Date}
 * @param {Date}
 * @returns {boolean}
 */
const areDatesEqual = (date1: Date, date2: Date): boolean => {
  return date1.getTime() === date2.getTime();
};

export default { hoursFromNowInEpochSeconds, areDatesEqual };
