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

export type RequestStatus = 'Pending' | 'In Progress' | 'Fulfilled';

export interface DisasterRequest {
  id: string;
  disasterType: DisasterType;
  region: string;
  population: number;
  requestedResource: Category;
  quantity: number;
  urgency: PriorityLevel;
  urgencyScore: number;
  time: string; // ISO String
  status: RequestStatus;
  assignedReliefCenter?: string;
}
