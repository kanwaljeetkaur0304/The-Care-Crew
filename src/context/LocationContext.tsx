import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

export type City = string;

interface LocationContextType {
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  isAllLocations: boolean;
  matchesCity: (location: string) => boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<City>('All Locations');

  const isAllLocations = selectedCity === 'All Locations';

  const matchesCity = useCallback(
    (location: string): boolean => {
      if (isAllLocations) return true;
      const cityName = selectedCity.split(',')[0].toLowerCase().trim();
      return location.toLowerCase().includes(cityName);
    },
    [selectedCity, isAllLocations]
  );

  const value = useMemo(
    () => ({ selectedCity, setSelectedCity, isAllLocations, matchesCity }),
    [selectedCity, isAllLocations, matchesCity]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}
