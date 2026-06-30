import { createContext, useContext, useState } from 'react'

const DistrictContext = createContext(null)

export const DistrictProvider = ({ children }) => {
  const [chamber, setChamber] = useState('house')
  const [activeHouseDistrict, setActiveHouseDistrict] = useState('')
  const [activeSenateDistrict, setActiveSenateDistrict] = useState('')

  return (
    <DistrictContext.Provider value={{
      chamber, setChamber,
      activeHouseDistrict, setActiveHouseDistrict,
      activeSenateDistrict, setActiveSenateDistrict
    }}>
      {children}
    </DistrictContext.Provider>
  )
}

export const useDistrict = () => useContext(DistrictContext)
