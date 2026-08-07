import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Resource, ReliefCenter, EmergencyMission, AllocationLog, SystemEvent, MissionPhase } from '../utils/types';
import { mockResources, mockCenters, mockMissions } from '../data/mockData';
import { quickSort } from '../algorithms/sorting/quickSort';

interface AppContextType {
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  centers: ReliefCenter[];
  setCenters: React.Dispatch<React.SetStateAction<ReliefCenter[]>>;
  missions: EmergencyMission[];
  setMissions: React.Dispatch<React.SetStateAction<EmergencyMission[]>>;
  isEmergencyMode: boolean;
  setEmergencyMode: React.Dispatch<React.SetStateAction<boolean>>;
  allocationLogs: AllocationLog[];
  systemEvents: SystemEvent[];
  processMission: (missionId: string) => Promise<void>;
  addSystemEvent: (type: SystemEvent['type'], message: string, priority?: SystemEvent['priority']) => void;
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

  const [missions, setMissions] = useState<EmergencyMission[]>(() => {
    const saved = localStorage.getItem('disaster_missions');
    return saved ? JSON.parse(saved) : mockMissions;
  });

  const [allocationLogs, setAllocationLogs] = useState<AllocationLog[]>(() => {
    const saved = localStorage.getItem('disaster_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [systemEvents, setSystemEvents] = useState<SystemEvent[]>(() => {
    const saved = localStorage.getItem('disaster_events');
    return saved ? JSON.parse(saved) : [];
  });

  const [isEmergencyMode, setEmergencyMode] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('disaster_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('disaster_centers', JSON.stringify(centers));
  }, [centers]);

  useEffect(() => {
    localStorage.setItem('disaster_missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('disaster_logs', JSON.stringify(allocationLogs));
  }, [allocationLogs]);

  useEffect(() => {
    localStorage.setItem('disaster_events', JSON.stringify(systemEvents));
  }, [systemEvents]);

  const addSystemEvent = (type: SystemEvent['type'], message: string, priority: SystemEvent['priority'] = 'Medium') => {
    const newEvent: SystemEvent = {
      id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      type,
      message,
      priority
    };
    setSystemEvents(prev => [newEvent, ...prev].slice(0, 100)); // Keep last 100 events
  };

  const updateMissionState = (missionId: string, phase: MissionPhase, progress: number, extraData: Partial<EmergencyMission> = {}) => {
    setMissions(prev => prev.map(m => {
      if (m.missionId === missionId) {
        return {
          ...m,
          ...extraData,
          status: phase,
          progressPercentage: progress,
          timeline: [...m.timeline, { phase, timestamp: new Date().toISOString() }]
        };
      }
      return m;
    }));
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const processMission = async (missionId: string) => {
    const mission = missions.find(m => m.missionId === missionId);
    if (!mission) return;

    // Start Phase
    updateMissionState(missionId, 'Searching', 20);
    addSystemEvent('SYSTEM', `Mission ${missionId} initiated. Searching inventory...`, 'Medium');
    await delay(1500);

    // Generate sorting simulation
    const sortStart = performance.now();
    const sortResult = quickSort([...centers], 'capacity', 'desc', false);
    const sortEnd = performance.now();
    
    updateMissionState(missionId, 'Sorting', 40);
    addSystemEvent('SYSTEM', `Quick Sort ranked ${centers.length} Relief Centers by capacity.`, 'Medium');
    await delay(1500);

    // Generate searching simulation (Linear Search through sorted centers)
    updateMissionState(missionId, 'Allocating', 60);
    let searchComparisons = 0;
    const searchStart = performance.now();
    let bestCenterId: string | null = null;
    let requiredQuantity = mission.requiredQuantity;
    let searchPath = [];
    
    for (const center of sortResult.sortedArray) {
      searchComparisons++;
      searchPath.push(center.id);
      if (center.status === 'Active' && center.capacity >= requiredQuantity) {
        bestCenterId = center.id;
        break;
      }
    }
    const searchEnd = performance.now();

    const dsaStats = {
      searchAlgorithm: 'Linear Search',
      sortAlgorithm: 'Quick Sort',
      comparisons: sortResult.comparisons + searchComparisons,
      executionTimeMs: Number(((searchEnd - searchStart) + (sortEnd - sortStart)).toFixed(2)),
      timeComplexity: 'O(N log N)',
      searchPath,
      sortedCenters: sortResult.sortedArray
    };

    if (bestCenterId) {
      addSystemEvent('SUCCESS', `Center ${bestCenterId} selected for Mission ${missionId}. Allocating resources...`, 'High');
      await delay(1500);

      // Perform the allocation
      setCenters(prev => prev.map(c => {
        if (c.id === bestCenterId) {
          return { ...c, capacity: c.capacity - requiredQuantity, resourcesAvailable: Math.max(0, c.resourcesAvailable - requiredQuantity) };
        }
        return c;
      }));

      setResources(prev => {
        let remainingToDeduct = requiredQuantity;
        return prev.map(res => {
          if (res.category === mission.requestedResource && remainingToDeduct > 0) {
            const deduction = Math.min(res.quantity, remainingToDeduct);
            remainingToDeduct -= deduction;
            return { ...res, quantity: res.quantity - deduction, status: (res.quantity - deduction) === 0 ? 'Depleted' : res.status };
          }
          return res;
        });
      });

      updateMissionState(missionId, 'Dispatching', 80, { assignedReliefCenter: bestCenterId, dsaStats });
      addSystemEvent('DISPATCH', `Dispatch vehicle assigned from ${bestCenterId}. En route to ${mission.region}.`, 'High');
      await delay(1500);

      updateMissionState(missionId, 'Completed', 100);
      addSystemEvent('UPDATE', `Mission ${missionId} completed successfully.`, 'Critical');
      
      setAllocationLogs(prev => [{
        id: `LOG-${Math.floor(Math.random() * 10000)}`,
        missionId,
        assignedCenterId: bestCenterId,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        message: `Allocated ${requiredQuantity} ${mission.requestedResource} from Center ${bestCenterId}`,
        dsaStats
      }, ...prev]);

    } else {
      addSystemEvent('ALERT', `Allocation Failed: No Active Relief Center has ${requiredQuantity} capacity.`, 'Critical');
      updateMissionState(missionId, 'Pending', 0);
      
      setAllocationLogs(prev => [{
        id: `LOG-${Math.floor(Math.random() * 10000)}`,
        missionId,
        assignedCenterId: null,
        timestamp: new Date().toISOString(),
        status: 'FAILED',
        message: `Failed to find Center with ${requiredQuantity} ${mission.requestedResource} capacity`,
        dsaStats
      }, ...prev]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        resources,
        setResources,
        centers,
        setCenters,
        missions,
        setMissions,
        isEmergencyMode,
        setEmergencyMode,
        allocationLogs,
        systemEvents,
        processMission,
        addSystemEvent
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
