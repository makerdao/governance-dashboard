import {
  DelegateObject,
  DelegationObject,
  DelegateBalance,
  MkrDelegatedData,
} from './types/delegate'

export default async function getGovernanceData(): Promise<{
  topDelegates: DelegateBalance[]
  mkrDelegatedData: MkrDelegatedData[]
}> {
  const delegates = await getAllDelegates()
  const { currentDelegatesBalance, delegations: allDelegations } =
    await getDelegations(delegates)

  const topDelegates = currentDelegatesBalance.sort(
    (a, b) => +b.lockTotal - +a.lockTotal
  )

  const mkrDelegatedData: MkrDelegatedData[] = []
  allDelegations
    .map((delegation) => ({
      time: delegation.blockTimestamp,
      amount: +delegation.lockAmount,
    }))
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
    .reduce((currVal, nextVal) => {
      mkrDelegatedData.push({
        time: new Date(nextVal.time),
        amount: currVal + nextVal.amount,
      })

      return currVal + nextVal.amount
    }, 0)

  return { topDelegates, mkrDelegatedData: mkrDelegatedData.slice(1) }
}

const getAllDelegates = async (): Promise<DelegateObject[]> => {
  const query = `
        {
          allDelegates {
            nodes {
              blockTimestamp
              voteDelegate
            }
          }
        }
      `

  const res = await fetch('https://polling-db-prod.makerdux.com/api/v1', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })

  const data = await res.json()

  const delegates: DelegateObject[] = data.data.allDelegates.nodes

  return delegates
}

const getDelegations = async (
  delegates: DelegateObject[]
): Promise<{
  currentDelegatesBalance: DelegateBalance[]
  delegations: DelegationObject[]
}> => {
  const rawDelegations = await Promise.all(
    delegates.map(async (delegate) => {
      const query = `{
      mkrLockedDelegate(argAddress: "${
        delegate.voteDelegate
      }", unixtimeEnd: ${Math.floor(Date.now() / 1000)}, unixtimeStart: 0) {
        nodes {
          fromAddress
          blockTimestamp
          lockAmount
          lockTotal
        }
      }
    }`

      const res = await fetch('https://polling-db-prod.makerdux.com/api/v1', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      const data = await res.json()

      const delegations: DelegationObject[] = data.data.mkrLockedDelegate.nodes

      const delegateBalance = {
        voteDelegate: delegate.voteDelegate,
        lockTotal: delegations[delegations.length - 1]?.lockTotal || '0',
      }

      return {
        delegateBalance,
        delegations,
      }
    })
  )

  const currentDelegatesBalance = rawDelegations.map(
    (delegation) => delegation.delegateBalance
  )
  const delegations = rawDelegations
    .map((delegation) => delegation.delegations)
    .flat()

  return { currentDelegatesBalance, delegations }
}
