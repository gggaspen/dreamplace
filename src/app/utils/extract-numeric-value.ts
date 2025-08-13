const extractNumericValue: (cssValue: string) => number = (cssValue: string) => {
  const match: RegExpMatchArray | null = cssValue.match(/^(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1] || '0') : NaN;
};

export { extractNumericValue };
