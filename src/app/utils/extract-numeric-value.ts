const extractNumericValue: (cssValue: string) => number = (
  cssValue: string
) => {
  const match: any = cssValue.match(/^(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : NaN;
};

export { extractNumericValue };
