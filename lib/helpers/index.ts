import { DelegateBalance } from '../types/delegate'

export const kFormatter = (num: number): string | number => {
  return num > 999 ? (num / 1000).toFixed(1) + 'k' : num
}

export const kFormatterInt = (num: number): string | number => {
  return num > 999 ? num / 1000 + 'k' : num
}

export const reduceAndFormatDelegations = (
  delegates: DelegateBalance[] | undefined
): string | number => {
  return delegates
    ? kFormatter(
        delegates.reduce(
          (acum, delegate) => acum + parseInt(delegate.lockTotal),
          0
        )
      )
    : 0
}

export const reduceDelegators = (
  delegates: DelegateBalance[] | undefined
): number => {
  return delegates
    ? delegates.reduce((acum, delegate) => acum + delegate.delegatorCount, 0)
    : 0
}
