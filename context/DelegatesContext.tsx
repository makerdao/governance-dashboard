import {
  createContext,
  useContext,
  ReactNode,
  ReactElement,
  useState,
  useEffect,
} from 'react'
import { useRouter } from 'next/router'
import useSWRImmutable from 'swr/immutable'

interface OnChainComment {
  commentType: 'onChain'
  voteType: 'Poll' | 'Executive'
  id: number | string
  username: string
  comment: string
  date: string
  url: string
  avatarUrl: string
}

interface ForumComment {
  commentType: 'forum'
  username: string
  comment: string
  date: string
  url: string
  avatarUrl: string
}

export type ProposalComment = OnChainComment | ForumComment

interface DelegateData {
  name: string
  voteDelegateAddress: string
  picture: string
  communication: string
  combinedParticipation: string
  pollParticipation: string
  executiveParticipation: string
  mkrDelegated: number
  comments?: ProposalComment[]
}

interface DelegateResData extends DelegateData {
  status: 'aligned' | 'shadow'
}

interface ContextProps {
  delegatesData: DelegateData[]
  fetchComments: (
    delegateName: string,
    delegateAddress: string
  ) => Promise<void>
}

export const DelegatesContext = createContext<ContextProps>({
  delegatesData: [],
  fetchComments: async () => {},
})

type PropTypes = {
  children: ReactNode
}

export const useDelegates = () => useContext(DelegatesContext)

export const DelegatesProvider = ({ children }: PropTypes): ReactElement => {
  const router = useRouter()
  const [delegatesData, setDelegatesData] = useState<DelegateData[]>([])

  const fetcher = (endpoint: string) =>
    fetch(endpoint).then((res) => res.json())
  const { data: rawDelegatesData } = useSWRImmutable(
    () =>
      router.route.startsWith('/delegates')
        ? 'https://vote.makerdao.com/api/delegates/names'
        : null,
    fetcher
  )

  useEffect(() => {
    if (rawDelegatesData && rawDelegatesData.length) {
      const parsedDelegatesData = rawDelegatesData
        .filter((delegate: DelegateResData) => delegate.status === 'aligned')
        .map((delegate: DelegateResData) => ({
          name: delegate.name,
          voteDelegateAddress: delegate.voteDelegateAddress,
          picture: delegate.picture,
          communication: delegate.communication,
          combinedParticipation: delegate.combinedParticipation,
          pollParticipation: delegate.pollParticipation,
          executiveParticipation: delegate.executiveParticipation,
          mkrDelegated: Math.round(+delegate.mkrDelegated),
        }))
        .sort(
          (a: DelegateData, b: DelegateData) => b.mkrDelegated - a.mkrDelegated
        )

      setDelegatesData(parsedDelegatesData)
    }
  }, [rawDelegatesData])

  const fetchDelegatePlatform = async (
    delegate: string
  ): Promise<ForumComment[] | void> => {
    const delegatePlatformRes = await fetch(
      `/api/delegate-comments/forum?delegate=${delegate}`
    )
    if (delegatePlatformRes.status !== 200) return
    const delegatePlatformBody: ForumComment[] =
      await delegatePlatformRes.json()
    return delegatePlatformBody
  }

  const fetchOnChainComments = async (
    delegate: string
  ): Promise<OnChainComment[] | void> => {
    const onChainCommentsRes = await fetch(
      `/api/delegate-comments/on-chain?delegate=${delegate}`
    )
    if (onChainCommentsRes.status !== 200) return
    const onChainCommentsBody: OnChainComment[] =
      await onChainCommentsRes.json()
    return onChainCommentsBody
  }

  const fetchComments = async (
    delegateName: string,
    delegateAddress: string
  ): Promise<void> => {
    const [delegatePlatform, onChainComments] = await Promise.all([
      fetchDelegatePlatform(delegateName),
      fetchOnChainComments(delegateAddress),
    ])

    if (!delegatePlatform || !onChainComments) return

    const formattedComments = [...delegatePlatform, ...onChainComments].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    setDelegatesData((oldDelegateData) =>
      oldDelegateData.map((del) =>
        del.name !== delegateName
          ? del
          : {
              ...del,
              comments: formattedComments,
            }
      )
    )
  }

  return (
    <DelegatesContext.Provider
      value={{
        delegatesData,
        fetchComments,
      }}
    >
      {children}
    </DelegatesContext.Provider>
  )
}
