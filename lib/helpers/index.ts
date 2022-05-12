import { DelegateBalance } from '../types/delegate'

export const kFormatter = (num: number, decimals: number = 1): string => {
  return num > 999
    ? (num / 1000).toFixed(decimals) + 'k'
    : num.toFixed(decimals)
}

export const kFormatterInt = (num: number): string | number => {
  return num > 999 ? Math.round(num / 1000) + 'k' : Math.round(num)
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

export const calculateTimeDiff = (endTime: number): string => {
  const timeDiffNum = Math.round((endTime - Date.now()) / 1000)
  if (timeDiffNum <= 0) return 'Ended'

  const hour = 60 * 60
  const day = hour * 24
  const result = []

  const remainingDays = Math.floor(timeDiffNum / day)
  if (remainingDays > 0) result.push(remainingDays + 'D')

  const remainingTime = timeDiffNum % day
  const remainingHours = Math.round(remainingTime / hour)
  if (remainingHours > 0) result.push(remainingHours + 'H')
  else result.push('< 1H')

  return result.join(' ')
}
