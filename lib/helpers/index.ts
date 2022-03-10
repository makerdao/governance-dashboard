export const kFormatter = (num: number): string | number => {
  return num > 999 ? (num / 1000).toFixed(1) + 'k' : num
}

export const kFormatterInt = (num: number): string | number => {
  return num > 999 ? num / 1000 + 'k' : num
}
