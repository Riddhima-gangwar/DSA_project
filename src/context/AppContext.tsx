import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Resource, ReliefCenter, DisasterRequest } from '../utils/types';
import { mockResources, mockCenters, mockRequests } from '../data/mockData';

interface AppContextType {
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  centers: ReliefCenter[];
  setCenters: React.Dispatch<React.SetStateAction<ReliefCenter[]>>;
  requests: DisasterRequest[];
  setRequests: React.Dispatch<React.SetStateAction<DisasterRequest[]>>;
  isEmergencyMode: boolean;
  setEmergencyMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem('disaster_resources');
    return saved ? JSON.parse(saved) : mockResources;
  });

  const [centers, setCenters] = useState<ReliefCenter[]>(() => {
    const saved = localStorage.getItem('disaster_centers');
    return saved ? JSON.parse(saved) : mockCenters;
  });

  const [requests, setRequests] = useState<DisasterRequest[]>(() => {
    const saved = localStorage.getItem('disaster_requests');
    return saved ? JSON.parse(saved) : mockRequests;
  });

  const [isEmergencyMode, setEmergencyMode] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('disaster_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('disaster_centers', JSON.stringify(centers));
  }, [centers]);

  useEffect(() => {
    localStorage.setItem('disaster_requests', JSON.stringify(requests));
  }, [requests]);

  return (
    <AppContext.Provider
      value={{
        resources,
        setResources,
        centers,
        setCenters,
        requests,
        setRequests,
        isEmergencyMode,
        setEmergencyMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
