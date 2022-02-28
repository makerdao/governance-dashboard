import { ethers, Contract, ContractInterface } from 'ethers'

const NETWORK_PROVIDER = process.env.NETWORK_PROVIDER || ''

const getProvider = () =>
  new ethers.providers.JsonRpcProvider(NETWORK_PROVIDER, 'mainnet')

export const getContract = (
  address: string,
  abi: ContractInterface
): Contract => {
  const provider = getProvider()
  const contract = new Contract(address, abi, provider)
  return contract
}
