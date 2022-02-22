export type DelegateObject = {
  delegate: string
  voteDelegate: string
  blockTimestamp: Date
}

export type DelegationObject = {
  fromAddress: string
  lockAmount: string
  blockTimestamp: Date
  lockTotal: string
}

export type DelegateBalance = {
  voteDelegate: string
  lockTotal: string
}

export type MkrDelegatedData = {
  time: Date
  amount: number
}
