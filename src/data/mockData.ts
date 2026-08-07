import { ReliefCenter, Resource, EmergencyMission } from '../utils/types';

export const mockCenters: ReliefCenter[] = [
  { id: 'C-001', name: 'Central Command Base', region: 'North District', capacity: 10000, manager: 'Sarah Jenkins', contact: '+1-555-0101', status: 'Active', resourcesAvailable: 8015, personnel: 150, vehicles: 20, nearestDisasterRegion: 'City Center' },
  { id: 'C-002', name: 'Coastal Relief Point', region: 'East Coast', capacity: 5000, manager: 'David Chen', contact: '+1-555-0102', status: 'Active', resourcesAvailable: 2005, personnel: 75, vehicles: 12, nearestDisasterRegion: 'East Coast' },
  { id: 'C-003', name: 'Highland Shelter', region: 'Mountain Region', capacity: 2000, manager: 'Elena Rodriguez', contact: '+1-555-0103', status: 'Active', resourcesAvailable: 1800, personnel: 40, vehicles: 5, nearestDisasterRegion: 'Mountain Region' },
  { id: 'C-004', name: 'Downtown Medical Hub', region: 'City Center', capacity: 8000, manager: 'Dr. James Smith', contact: '+1-555-0104', status: 'Overwhelmed', resourcesAvailable: 2000, personnel: 200, vehicles: 15, nearestDisasterRegion: 'City Center' },
  { id: 'C-005', name: 'South District Post', region: 'South District', capacity: 3000, manager: 'Michael Brown', contact: '+1-555-0105', status: 'Offline', resourcesAvailable: 500, personnel: 20, vehicles: 2, nearestDisasterRegion: 'South District' }
];

export const mockResources: Resource[] = [
  { id: 'R-101', name: 'Purified Water 1L', category: 'Water', quantity: 5000, priority: 'Critical', priorityScore: 5, reliefCenterId: 'C-001', status: 'Available', lastUpdated: new Date().toISOString() },
  { id: 'R-102', name: 'First Aid Kits', category: 'Medicine', quantity: 800, priority: 'Critical', priorityScore: 5, reliefCenterId: 'C-004', status: 'Available', lastUpdated: new Date().toISOString() },
  { id: 'R-103', name: 'Canned Beans', category: 'Food', quantity: 2000, priority: 'Medium', priorityScore: 3, reliefCenterId: 'C-002', status: 'Available', lastUpdated: new Date().toISOString() },
  { id: 'R-104', name: 'Diesel Generators', category: 'Fuel', quantity: 15, priority: 'High', priorityScore: 4, reliefCenterId: 'C-001', status: 'Available', lastUpdated: new Date().toISOString() },
  { id: 'R-105', name: 'Thermal Blankets', category: 'Blankets', quantity: 1500, priority: 'Low', priorityScore: 2, reliefCenterId: 'C-003', status: 'Available', lastUpdated: new Date().toISOString() },
  { id: 'R-106', name: 'Emergency Tents', category: 'Shelter', quantity: 300, priority: 'High', priorityScore: 4, reliefCenterId: 'C-003', status: 'Available', lastUpdated: new Date().toISOString() },
  { id: 'R-107', name: 'Rescue Boats', category: 'Rescue Equipment', quantity: 5, priority: 'Critical', priorityScore: 5, reliefCenterId: 'C-002', status: 'Available', lastUpdated: new Date().toISOString() },
  { id: 'R-108', name: 'Antibiotics', category: 'Medicine', quantity: 1200, priority: 'Critical', priorityScore: 5, reliefCenterId: 'C-004', status: 'Available', lastUpdated: new Date().toISOString() },
  { id: 'R-109', name: 'Rice Bags 5kg', category: 'Food', quantity: 3000, priority: 'Medium', priorityScore: 3, reliefCenterId: 'C-001', status: 'Available', lastUpdated: new Date().toISOString() },
  { id: 'R-110', name: 'Flashlights', category: 'Rescue Equipment', quantity: 500, priority: 'Very Low', priorityScore: 1, reliefCenterId: 'C-005', status: 'In Transit', lastUpdated: new Date().toISOString() },
];

export const mockMissions: EmergencyMission[] = [
  {
    missionId: 'MSN-8001',
    disasterType: 'Flood',
    region: 'East Coast',
    population: 50000,
    requestedResource: 'Rescue Equipment',
    requiredQuantity: 3,
    priority: 'Critical',
    priorityScore: 5,
    createdTime: new Date(Date.now() - 3600000).toISOString(),
    status: 'Pending',
    progressPercentage: 0,
    timeline: [
      { phase: 'Pending', timestamp: new Date(Date.now() - 3600000).toISOString() }
    ]
  },
  {
    missionId: 'MSN-8002',
    disasterType: 'Earthquake',
    region: 'City Center',
    population: 120000,
    requestedResource: 'Medicine',
    requiredQuantity: 500,
    priority: 'Critical',
    priorityScore: 5,
    createdTime: new Date(Date.now() - 7200000).toISOString(),
    status: 'Pending',
    progressPercentage: 0,
    timeline: [
      { phase: 'Pending', timestamp: new Date(Date.now() - 7200000).toISOString() }
    ]
  },
  {
    missionId: 'MSN-8003',
    disasterType: 'Wildfire',
    region: 'Mountain Region',
    population: 15000,
    requestedResource: 'Water',
    requiredQuantity: 1000,
    priority: 'High',
    priorityScore: 4,
    createdTime: new Date(Date.now() - 10800000).toISOString(),
    status: 'Pending',
    progressPercentage: 0,
    timeline: [
      { phase: 'Pending', timestamp: new Date(Date.now() - 10800000).toISOString() }
    ]
  }
];
