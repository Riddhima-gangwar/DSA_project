export type Category = 'Water' | 'Food' | 'Medicine' | 'Fuel' | 'Blankets' | 'Shelter' | 'Rescue Equipment';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Very Low';

export type ResourceStatus = 'Available' | 'In Transit' | 'Depleted';

export interface Resource {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  priority: PriorityLevel;
  priorityScore: number;
  reliefCenterId: string;
  status: ResourceStatus;
  lastUpdated: string; // ISO String
}

export type CenterStatus = 'Active' | 'Overwhelmed' | 'Offline';

export interface ReliefCenter {
  id: string;
  name: string;
  region: string;
  capacity: number;
  manager: string;
  contact: string;
  status: CenterStatus;
  resourcesAvailable: number;
  personnel: number;
  vehicles: number;
  nearestDisasterRegion: string;
}

export type DisasterType = 'Flood' | 'Earthquake' | 'Cyclone' | 'Wildfire' | 'Tsunami';

export type MissionPhase = 'Pending' | 'Searching' | 'Sorting' | 'Allocating' | 'Dispatching' | 'Completed';

export interface MissionTimelineEvent {
  phase: MissionPhase;
  timestamp: string; // ISO String
}

export interface DsaStats {
  searchAlgorithm: string;
  sortAlgorithm: string;
  comparisons: number;
  executionTimeMs: number;
  timeComplexity: string;
  // Store the state of execution for replay
  searchPath?: string[];
  sortedCenters?: ReliefCenter[];
}

export interface EmergencyMission {
  missionId: string;
  disasterType: DisasterType;
  region: string;
  population: number;
  requestedResource: Category;
  requiredQuantity: number;
  priority: PriorityLevel;
  priorityScore: number;
  createdTime: string; // ISO String
  status: MissionPhase;
  assignedReliefCenter?: string;
  assignedVehicle?: string;
  progressPercentage: number;
  timeline: MissionTimelineEvent[];
  dsaStats?: DsaStats;
}

export type EventType = 'ALERT' | 'DISPATCH' | 'SYSTEM' | 'SUCCESS' | 'UPDATE';

export interface SystemEvent {
  id: string;
  timestamp: string; // ISO String
  type: EventType;
  message: string;
  priority: PriorityLevel;
}

export interface AllocationLog {
  id: string;
  missionId: string;
  assignedCenterId: string | null;
  timestamp: string; // ISO String
  status: 'SUCCESS' | 'FAILED';
  message: string;
  dsaStats: DsaStats;
}
