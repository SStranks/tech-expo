/**
 * @param {number} length integer >= 1
 * @returns {number} random positive integer of length
 */
const generateRandomInteger = (length: number): number => {
  if (length < 1 || !Number.isInteger(length)) throw new Error('Length must be an integer greater than 1');
  return Math.floor(Math.pow(10, length) / 10 + Math.random() * (9 * (Math.pow(10, length) / 10)));
};

export default { generateRandomInteger };
