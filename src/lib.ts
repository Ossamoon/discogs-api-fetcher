export const intersection = <T>(arr1: T[], arr2: T[]): T[] => {
  return arr1.filter((item) => arr2.includes(item));
};

export const sleep = (duration: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};
