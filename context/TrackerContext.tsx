import {
  createContext,
  useContext,
  ReactNode,
  ReactElement,
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
} from 'react'
import useSWRImmutable from 'swr/immutable'
import { DateTime } from 'luxon'

import { Proposal } from '../lib/types/tracker'

type Proposals = Proposal[] | undefined

interface ContextProps {
  executiveProposals: Proposals
  onChainPolls: Proposals
  offChainPolls: Proposals
  forumDiscussions: Proposals
  archivedProposals: Proposals
  activeProposals: Proposals
  highImpactProposals: Proposals
  endingThisWeekProposals: Proposals
  setFetchArchive: Dispatch<SetStateAction<boolean>>
}

export const TrackerContext = createContext<ContextProps>({
  executiveProposals: undefined,
  onChainPolls: undefined,
  offChainPolls: undefined,
  forumDiscussions: undefined,
  archivedProposals: undefined,
  activeProposals: undefined,
  highImpactProposals: undefined,
  endingThisWeekProposals: undefined,
  setFetchArchive: () => {},
})

type PropTypes = {
  children: ReactNode
}

export const useTracker = () => useContext(TrackerContext)

export const TrackerProvider = ({ children }: PropTypes): ReactElement => {
  const [executiveProposals, setExecutiveProposals] = useState<Proposals>()
  const [onChainPolls, setOnChainPolls] = useState<Proposals>()
  const [offChainPolls, setOffChainPolls] = useState<Proposals>()
  const [forumDiscussions, setForumDiscussions] = useState<Proposals>()
  const [fetchArchive, setFetchArchive] = useState<boolean>(false)
  const [archivedProposals, setArchivedProposals] = useState<Proposals>()
  const [activeProposals, setActiveProposals] = useState<Proposals>()
  const [highImpactProposals, setHighImpactProposals] = useState<Proposals>()
  const [endingThisWeekProposals, setEndingThisWeekProposals] =
    useState<Proposals>()

  const fetcher = (endpoint: string) =>
    fetch(endpoint).then((res) => res.json())
  const { data: proposalsData } = useSWRImmutable(
    '/api/tracker/proposals',
    fetcher
  )
  const { data: archiveData } = useSWRImmutable(
    fetchArchive ? '/api/tracker/archive' : null,
    fetcher
  )

  useEffect(() => {
    if (proposalsData) {
      const allProposals = [
        ...proposalsData.executive,
        ...proposalsData.onChainPolls,
        ...proposalsData.offChainPolls,
        ...proposalsData.forumDiscussions,
      ]

      setExecutiveProposals(proposalsData.executive)
      setOnChainPolls(proposalsData.onChainPolls)
      setOffChainPolls(proposalsData.offChainPolls)
      setForumDiscussions(proposalsData.forumDiscussions)
      setActiveProposals(filterActive(allProposals))
      setHighImpactProposals(filterHighImpact(allProposals))
      setEndingThisWeekProposals(filterEndingThisWeek(allProposals))
    }
  }, [proposalsData])

  useEffect(() => {
    if (archiveData) setArchivedProposals(archiveData)
  }, [archiveData])

  const filterActive = (proposalArr: Proposal[]): Proposals =>
    proposalArr.filter(
      (p) => p.activityStatus === 'Active' || !p.activityStatus
    )

  const filterHighImpact = (proposalArr: Proposal[]): Proposals =>
    proposalArr.filter((p) => p.impact === 'High')

  const filterEndingThisWeek = (proposalArr: Proposal[]): Proposals =>
    proposalArr.filter((p) => {
      const currentTime = DateTime.utc()
      const thisWeekEnd = DateTime.utc().endOf('week')
      const endDate = DateTime.fromISO(p.endDate)
      return (
        endDate < thisWeekEnd &&
        endDate > currentTime &&
        (p.activityStatus === 'Active' || !p.activityStatus)
      )
    })

  return (
    <TrackerContext.Provider
      value={{
        executiveProposals,
        onChainPolls,
        offChainPolls,
        forumDiscussions,
        archivedProposals,
        setFetchArchive,
        activeProposals,
        highImpactProposals,
        endingThisWeekProposals,
      }}
    >
      {children}
    </TrackerContext.Provider>
  )
}
