import {
  createContext,
  useContext,
  ReactNode,
  ReactElement,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'

interface ContextProps {
  showExpiredDelegates: boolean
  setShowExpiredDelegates: Dispatch<SetStateAction<boolean>>
  selectedAddress: string | null
  setSelectedAddress: Dispatch<SetStateAction<string | null>>
  selectedDelegate: string | null
  setSelectedDelegate: Dispatch<SetStateAction<string | null>>
  handleSelectDelegate: (address: string | null, delegate?: string) => void
  selectedStartDate: string | null
  setSelectedStartDate: Dispatch<SetStateAction<string | null>>
  selectedEndDate: string | null
  setSelectedEndDate: Dispatch<SetStateAction<string | null>>
  selectedTime: number | null
  setSelectedTime: Dispatch<SetStateAction<number | null>>
}

export const DashboardContext = createContext<ContextProps>({
  showExpiredDelegates: false,
  setShowExpiredDelegates: () => {},
  selectedAddress: null,
  setSelectedAddress: () => {},
  selectedDelegate: null,
  setSelectedDelegate: () => {},
  handleSelectDelegate: () => {},
  selectedStartDate: null,
  setSelectedStartDate: () => {},
  selectedEndDate: null,
  setSelectedEndDate: () => {},
  selectedTime: null,
  setSelectedTime: () => {},
})

type PropTypes = {
  children: ReactNode
}

export const useDashboard = () => useContext(DashboardContext)

export const DashboardProvider = ({ children }: PropTypes): ReactElement => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [selectedDelegate, setSelectedDelegate] = useState<string | null>(null)
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    null
  )
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<number | null>(null)
  const [showExpiredDelegates, setShowExpiredDelegates] =
    useState<boolean>(false)

  const handleSelectDelegate = (
    address: string | null,
    delegate?: string
  ): void => {
    setSelectedDelegate(delegate || null)
    setSelectedAddress(address)
  }

  return (
    <DashboardContext.Provider
      value={{
        showExpiredDelegates,
        setShowExpiredDelegates,
        selectedAddress,
        setSelectedAddress,
        selectedDelegate,
        setSelectedDelegate,
        handleSelectDelegate,
        selectedStartDate,
        setSelectedStartDate,
        selectedEndDate,
        setSelectedEndDate,
        selectedTime,
        setSelectedTime,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}
