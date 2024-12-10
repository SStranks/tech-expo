export const MAX_PASSWORD = 's!i0bF$qeVx';

export const usePasswordStrength = (password: string) => {
  if (password == '') return { score: 0 };
  if (password === MAX_PASSWORD) return { score: 4 };
  return;
};
