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
  immediateCaller: string
}

export type AllDelegationsObject = {
  time: Date
  amount: number
  sender: string
  delegate: string
}

export type DelegateBalance = {
  voteDelegate: string
  lockTotal: string
  delegatorCount: number
  name: string
  status: string
}

export type MkrDelegatedData = {
  time: Date
  amount: number
}

export type MkrStakedData = {
  time: Date
  amount: number
  sender: string
}

export type PollVotersData = {
  pollId: number
  month: string
  uniqueVoters: number
}

export type UserBalances = {
  time: Date
  balances: { sender: string; amount: number; delegated: number }[]
}

export type GroupedUserBalances = {
  recognizedDelegates: {
    address: string
    amount: number
    name: string
  }[]
  shadowDelegates: {
    address: string
    amount: number
  }[]
  users: {
    address: string
    amount: number
  }[]
}
