import Maker from '@makerdao/dai'
import GovernancePlugin, { MKR } from '@makerdao/dai-plugin-governance'
import { MakerClass } from '@makerdao/dai/dist/Maker'

const NETWORK_PROVIDER = process.env.NETWORK_PROVIDER || ''

const getMaker = async (): Promise<MakerClass> => {
  const instance = await Maker.create('http', {
    provider: {
      url: NETWORK_PROVIDER,
      type: 'HTTP',
    },
    plugins: [[GovernancePlugin, { network: 'mainnet', staging: false }]],
    web3: {
      pollingInterval: null,
    },
    log: false,
    multicall: true,
  })

  return instance
}

export default getMaker
export { MKR }
