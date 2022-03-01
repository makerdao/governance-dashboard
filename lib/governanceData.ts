import { utils } from 'ethers'
import { getContract } from './ethers'
import { CHIEF_ADDRESS } from './contracts/addresses'
import CHIEF_ABI from './contracts/abis/DSChief.json'
import {
  DelegateObject,
  DelegationObject,
  DelegateBalance,
  MkrDelegatedData,
  MkrStakedData,
  PollVotersData,
} from './types/delegate'

export const getGovernanceData = async (): Promise<{
  topDelegates: DelegateBalance[]
  mkrDelegatedData: MkrDelegatedData[]
  totalDelegatorCount: number
}> => {
  const delegationsRes = await getDelegations()

  const {
    currentDelegatesBalance,
    delegations: allDelegations,
    totalDelegatorCount,
  } = delegationsRes

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

  return {
    topDelegates,
    mkrDelegatedData: mkrDelegatedData.slice(1),
    totalDelegatorCount,
  }
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

const getDelegations = async (): Promise<{
  currentDelegatesBalance: DelegateBalance[]
  delegations: DelegationObject[]
  totalDelegatorCount: number
}> => {
  const delegates = await getAllDelegates()
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

      const delegatorsBalances: Map<string, number> = new Map()
      delegations.forEach((delegation) => {
        delegatorsBalances.set(
          delegation.fromAddress,
          delegatorsBalances.has(delegation.fromAddress)
            ? // @ts-ignore
              delegatorsBalances.get(delegation.fromAddress) +
                +delegation.lockAmount
            : +delegation.lockAmount
        )
      })

      let delegatorCount: number = 0
      delegatorsBalances.forEach((value) => {
        if (value > 0) delegatorCount++
      })

      const delegateBalance = {
        voteDelegate: delegate.voteDelegate,
        lockTotal: delegations[delegations.length - 1]?.lockTotal || '0',
        delegatorCount,
        name: '',
        status: '',
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

  const delegatesMetadataRes = await fetch(
    'https://vote.makerdao.com/api/delegates'
  )
  const delegatesMetadata = await delegatesMetadataRes.json()

  if (delegatesMetadata.delegates) {
    // @ts-ignore
    delegatesMetadata.delegates.forEach((delegate) => {
      const currentDelegate = currentDelegatesBalance.find(
        (del) => del.voteDelegate === delegate.voteDelegateAddress
      )
      if (currentDelegate) {
        currentDelegate.name = delegate.name
        currentDelegate.status = delegate.status
      }
    })
  }

  const delegations = rawDelegations
    .map((delegation) => delegation.delegations)
    .flat()

  const totalDelegatorsBalances: Map<string, number> = new Map()
  delegations.forEach((delegation) => {
    totalDelegatorsBalances.set(
      delegation.fromAddress,
      totalDelegatorsBalances.has(delegation.fromAddress)
        ? // @ts-ignore
          totalDelegatorsBalances.get(delegation.fromAddress) +
            +delegation.lockAmount
        : +delegation.lockAmount
    )
  })

  let totalDelegatorCount: number = 0
  totalDelegatorsBalances.forEach((value) => {
    if (value > 0) totalDelegatorCount++
  })

  return { currentDelegatesBalance, delegations, totalDelegatorCount }
}

export const getStakedMkr = async (): Promise<MkrStakedData[]> => {
  const contract = getContract(CHIEF_ADDRESS, CHIEF_ABI)
  const lockEvents = await contract.queryFilter(
    {
      topics: [
        '0xdd46706400000000000000000000000000000000000000000000000000000000',
      ],
    },
    '0x487813'
  )

  const freeEvents = await contract.queryFilter(
    {
      topics: [
        '0xd8ccd0f300000000000000000000000000000000000000000000000000000000',
      ],
    },
    '0x487813'
  )

  const stakeEvents = [
    ...lockEvents.map((event) => ({
      blockNumber: event.blockNumber,
      sender: '0x' + event.topics[1].slice(-40),
      amount: +utils.formatEther(event.topics[2]),
    })),
    ...freeEvents.map((event) => ({
      blockNumber: event.blockNumber,
      sender: '0x' + event.topics[1].slice(-40),
      amount: -utils.formatEther(event.topics[2]),
    })),
  ].sort((a, b) => a.blockNumber - b.blockNumber)

  const blockNumbersSet = new Set(stakeEvents.map((event) => event.blockNumber))

  const query = `{
    blocks(first: 1000 where: {number_in: [${Array.from(blockNumbersSet)}]}) {
      number
      timestamp
    }
  }`

  const res = await fetch(
    'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    }
  )

  const data = await res.json()
  const blockRes: { number: string; timestamp: string }[] = data.data.blocks
  const blocksMap: Map<number, string> = new Map()
  blockRes.forEach((block) => blocksMap.set(+block.number, block.timestamp))

  const mkrStakedData: MkrStakedData[] = []

  stakeEvents
    .map((event) => ({
      // @ts-ignore
      time: new Date(blocksMap.get(event.blockNumber) * 1000),
      sender: event.sender,
      amount: event.amount,
    }))
    .reduce((currVal, nextVal) => {
      mkrStakedData.push({
        time: nextVal.time,
        amount: currVal + nextVal.amount,
        sender: nextVal.sender,
      })

      return currVal + nextVal.amount
    }, 0)

  return mkrStakedData
}

export const getPollVoters = async (): Promise<PollVotersData[]> => {
  const allPollsQuery = `{
    activePolls {
      nodes {
        pollId
        startDate
      }
    }
  }`

  const allPollsRes = await fetch(
    'https://polling-db-prod.makerdux.com/api/v1',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: allPollsQuery }),
    }
  )

  const allPollsData = await allPollsRes.json()
  const allPolls = allPollsData.data.activePolls.nodes

  const pollVoters: PollVotersData[] = await Promise.all(
    allPolls.map(
      async ({ pollId, startDate }: { pollId: number; startDate: number }) => {
        const uniqueVotersQuery = `{
      uniqueVoters(argPollId: ${pollId}) {
        nodes
      }
    }`

        const uniqueVotersRes = await fetch(
          'https://polling-db-prod.makerdux.com/api/v1',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: uniqueVotersQuery }),
          }
        )

        const uniqueVotersData = await uniqueVotersRes.json()
        const uniqueVoters = uniqueVotersData.data.uniqueVoters.nodes[0]
        const date = new Date(startDate * 1000)

        return {
          pollId,
          month: `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`,
          uniqueVoters: +uniqueVoters,
        }
      }
    )
  )

  const pollVotersData: {
    month: string
    uniqueVoters: number[]
    pollId: number
  }[] = pollVoters.reduce(
    (
      groups: { month: string; uniqueVoters: number[]; pollId: number }[],
      poll
    ) => {
      if (!groups.some((entry) => entry.month === poll.month))
        groups.push({
          month: poll.month,
          uniqueVoters: [poll.uniqueVoters],
          pollId: poll.pollId,
        })
      else
        groups
          .find((entry) => entry.month === poll.month)
          ?.uniqueVoters.push(poll.uniqueVoters)

      return groups
    },
    []
  )

  return pollVotersData.map(({ month, pollId, uniqueVoters }) => ({
    month,
    pollId,
    uniqueVoters: Math.round(
      uniqueVoters.reduce((a, b) => a + b) / uniqueVoters.length
    ),
  }))
}
