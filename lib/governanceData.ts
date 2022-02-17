import { MakerClass } from '@makerdao/dai/dist/Maker'
import { DelegateObject } from './types/delegate'
import getMaker from './maker'

export default async function getGovernanceData(): Promise<DelegateObject[]> {
  const maker = await getMaker()
  const delegates = getAllDelegates(maker)
  return delegates
}

const getAllDelegates = async (
  maker: MakerClass
): Promise<DelegateObject[]> => {
  const delegates: DelegateObject[] = await maker
    .service('voteDelegate')
    .getAllDelegates()
  return delegates
}
