import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlass, Plus, Funnel, ArrowsDownUp, PencilSimple, Trash, X, CaretLeft, CaretRight, 
  Heartbeat, ShieldWarning, Cpu, Package, Database, Truck, Warning, Info,
  AppleLogo, Pill, Tent, Drop, Fire, Lifebuoy, MapPin, Clock, ShieldCheck,
  Buildings, ChartPieSlice
} from '@phosphor-icons/react';
import { useAppContext } from '../context/AppContext';
import { Resource } from '../utils/types';
import { quickSort } from '../algorithms/sorting/quickSort';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function ResourceManagement() {
  const navigate = useNavigate();
  const { resources, setResources, isEmergencyMode, setEmergencyMode, centers, missions } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof Resource>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Resource>>({
    name: '', category: 'Water', quantity: 0, priority: 'Medium', status: 'Available', reliefCenterId: 'C1', priorityScore: 3
  });
  const [formError, setFormError] = useState('');

  const displayedResources = useMemo(() => {
    let result = [...resources];

    if (isEmergencyMode) {
      const { sortedArray } = quickSort(result, 'priorityScore', 'desc', false);
      result = sortedArray;
    } else {
      const { sortedArray } = quickSort(result, sortKey, sortOrder, false);
      result = sortedArray;
    }

    if (searchTerm) {
      const filtered = [];
      for (let i = 0; i < result.length; i++) {
        const nameMatch = result[i].name.toLowerCase().includes(searchTerm.toLowerCase());
        const catMatch = result[i].category.toLowerCase().includes(searchTerm.toLowerCase());
        if (nameMatch || catMatch) {
          filtered.push(result[i]);
        }
      }
      result = filtered;
    }
    return result;
  }, [resources, searchTerm, sortKey, sortOrder, isEmergencyMode]);

  const totalPages = Math.ceil(displayedResources.length / itemsPerPage);
  const paginatedResources = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return displayedResources.slice(start, start + itemsPerPage);
  }, [displayedResources, currentPage]);

  const handleSort = (key: keyof Resource) => {
    if (isEmergencyMode) return;
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
    setCurrentPage(1); 
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      setResources(resources.filter(r => r.id !== id));
      if (paginatedResources.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
    }
  };

  const openAddModal = () => {
    setEditingResource(null);
    setFormData({ name: '', category: 'Water', quantity: 0, priority: 'Medium', status: 'Available', reliefCenterId: 'C1', priorityScore: 3 });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (res: Resource) => {
    setEditingResource(res);
    setFormData({ ...res }); 
    setFormError('');
    setIsModalOpen(true);
  };

  const calculatePriorityScore = (priority: string) => {
    switch(priority) {
      case 'Critical': return 5;
      case 'High': return 4;
      case 'Medium': return 3;
      case 'Low': return 2;
      case 'Very Low': return 1;
      default: return 3;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.name.trim() === '') return setFormError('Name is required');
    if (!formData.quantity || formData.quantity <= 0) return setFormError('Quantity must be greater than 0');

    const priorityScore = calculatePriorityScore(formData.priority as string);
    const centerIdVal = formData.reliefCenterId || 'C1';

    if (editingResource) {
      setResources(resources.map(r => r.id === editingResource.id ? { ...r, ...formData, reliefCenterId: centerIdVal, priorityScore, lastUpdated: new Date().toISOString() } as Resource : r));
    } else {
      const newResource: Resource = {
        id: `R-${Math.floor(Math.random() * 10000)}`,
        name: formData.name,
        category: formData.category as any,
        quantity: Number(formData.quantity),
        priority: formData.priority as any,
        status: formData.status as any,
        reliefCenterId: centerIdVal,
        priorityScore,
        lastUpdated: new Date().toISOString()
      };
      setResources([newResource, ...resources]);
    }
    setIsModalOpen(false);
  };

  const totalQuantity = resources.reduce((acc, curr) => acc + curr.quantity, 0);
  const activeCentersCount = centers.filter(c => c.status === 'Active').length;
  const criticalMissionsCount = missions.filter(m => m.priority === 'Critical' && m.status !== 'Completed').length;
  const resourcesDelivered = missions.filter(m => m.status === 'Completed').length; 
  const lowStockCount = resources.filter(r => r.quantity < 100).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food': return <AppleLogo size={16} weight="light" className="text-orange-400" />;
      case 'Medicine': return <Pill size={16} weight="light" className="text-red-400" />;
      case 'Shelter': return <Tent size={16} weight="light" className="text-yellow-400" />;
      case 'Water': return <Drop size={16} weight="light" className="text-emerald-400" />;
      case 'Fuel': return <Fire size={16} weight="light" className="text-red-500" />;
      case 'Rescue Equipment': return <Lifebuoy size={16} weight="light" className="text-blue-400" />;
      default: return <Package size={16} weight="light" className="text-gray-400" />;
    }
  };

  const getRegionForCenter = (id: string) => centers.find(c => c.id === id)?.region || 'Unknown Region';
  const formatDate = (isoString: string) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Just now';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  return (
    <div className="space-y-12 pb-24 font-sans max-w-[1600px] mx-auto">
      
      {/* HEADER & ACTIONS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8"
      >
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold bg-white/5 border border-white/10 mb-4 text-gray-400">
            <Database size={12} weight="light" className="mr-2" /> Global Database
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter">Resource Inventory</h2>
          <p className="text-gray-400 text-base max-w-2xl leading-relaxed">
            Centralized registry for all relief supplies. Uses real-time algorithms to search and sort critical equipment across all active sectors.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button onClick={() => navigate('/dashboard/sorting')} className="group flex items-center justify-center px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium text-white shadow-lg shadow-black/50 active:scale-[0.98]">
            <Cpu size={18} weight="light" className="mr-2 opacity-70 group-hover:opacity-100 transition-opacity" />
            Compare Algorithms
          </button>
          
          <button onClick={openAddModal} className="group flex items-center justify-center px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 transition-all text-sm font-medium text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-[0.98]">
            Add Resource
            <div className="ml-3 w-6 h-6 rounded-full bg-black/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <Plus size={12} weight="bold" />
            </div>
          </button>
        </div>
      </motion.div>

      {/* KPI CARDS (Bento Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Resources', value: totalQuantity.toLocaleString(), icon: <Package weight="light" className="text-blue-400" /> },
          { label: 'Relief Centers', value: centers.length, icon: <Buildings weight="light" className="text-emerald-400" /> },
          { label: 'Critical Missions', value: criticalMissionsCount, icon: <Heartbeat weight="light" className="text-red-400" /> },
          { label: 'Missions Delivered', value: resourcesDelivered, icon: <Truck weight="light" className="text-purple-400" /> },
          { label: 'Low Stock Items', value: lowStockCount, icon: <Warning weight="light" className="text-orange-400" /> },
          { label: 'Distribution Rate', value: '92%', icon: <ChartPieSlice weight="light" className="text-emerald-400" /> },
        ].map((kpi, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: 0.1 + (i * 0.05) }}
            key={i} 
            className="glass-panel p-1.5"
          >
            <div className="glass-inner rounded-[calc(2rem-0.375rem)] p-5 flex flex-col justify-center h-full hover:bg-white/[0.02] transition-colors cursor-default">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{kpi.label}</span>
                {React.cloneElement(kpi.icon, { size: 20 })}
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">{kpi.value}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SEARCH BAR & TABLE */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.3 }}
        className="glass-panel p-2 flex flex-col overflow-hidden"
      >
        <div className="glass-inner rounded-[calc(2rem-0.5rem)] flex flex-col h-full overflow-hidden">
          
          <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full">
              <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} weight="light" />
              <input 
                id="search-input"
                type="text" 
                placeholder="Search inventory via O(N) Linear Search..." 
                value={searchTerm}
                onChange={handleSearch}
                className="w-full bg-black/50 border border-white/10 rounded-full pl-12 pr-6 py-3.5 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm text-white placeholder-gray-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
              />
            </div>
            <div className="flex space-x-3">
              <button className="px-6 py-3.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 flex items-center justify-center space-x-2 text-sm font-medium transition-colors">
                <Funnel size={18} weight="light" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[500px]">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                  <th className="p-6 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('id')}>
                    ID <ArrowsDownUp size={12} weight="light" className="inline ml-1 opacity-50" />
                  </th>
                  <th className="p-6 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>
                    Resource Name <ArrowsDownUp size={12} weight="light" className="inline ml-1 opacity-50" />
                  </th>
                  <th className="p-6 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('category')}>
                    Category <ArrowsDownUp size={12} weight="light" className="inline ml-1 opacity-50" />
                  </th>
                  <th className="p-6 cursor-pointer hover:text-white transition-colors">Region</th>
                  <th className="p-6 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('quantity')}>
                    Quantity <ArrowsDownUp size={12} weight="light" className="inline ml-1 opacity-50" />
                  </th>
                  <th className="p-6 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('priorityScore')}>
                    Priority <ArrowsDownUp size={12} weight="light" className="inline ml-1 opacity-50" />
                  </th>
                  <th className="p-6 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('status')}>
                    Status <ArrowsDownUp size={12} weight="light" className="inline ml-1 opacity-50" />
                  </th>
                  <th className="p-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedResources.map((res, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: index * 0.05, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                    key={res.id} 
                    className={clsx(
                      "border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group cursor-default",
                      res.priority === 'Critical' && isEmergencyMode ? 'bg-red-900/10' : ''
                    )}
                  >
                    <td className="p-6 text-gray-500 font-mono text-xs font-bold">{res.id}</td>
                    <td className="p-6 font-semibold text-sm text-gray-200 group-hover:text-white transition-colors">{res.name}</td>
                    <td className="p-6">
                      <span className="flex items-center space-x-2 text-sm text-gray-300">
                        {getCategoryIcon(res.category)}
                        <span>{res.category}</span>
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="flex items-center text-xs text-gray-400 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full w-max">
                        <MapPin size={12} weight="fill" className="mr-1.5 text-blue-400/50" />
                        {getRegionForCenter(res.reliefCenterId)}
                      </span>
                    </td>
                    <td className="p-6 font-mono text-sm font-bold text-gray-200">{res.quantity.toLocaleString()}</td>
                    <td className="p-6">
                      <span className={clsx("px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest border", 
                        res.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        res.priority === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        res.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      )}>
                        {res.priority}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={clsx("flex items-center space-x-2 text-xs font-bold uppercase tracking-wider", 
                        res.status === 'Available' ? 'text-emerald-400' : 
                        res.status === 'Depleted' ? 'text-red-400' : 'text-blue-400'
                      )}>
                        <span className={clsx("w-1.5 h-1.5 rounded-full", 
                          res.status === 'Available' ? 'bg-emerald-400' : 
                          res.status === 'Depleted' ? 'bg-red-400' : 'bg-blue-400 animate-pulse'
                        )} />
                        <span>{res.status}</span>
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center space-x-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(res)} className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                          <PencilSimple size={16} weight="light" />
                        </button>
                        <button onClick={() => handleDelete(res.id)} className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash size={16} weight="light" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {paginatedResources.length === 0 && (
              <div className="p-24 flex flex-col items-center justify-center text-gray-500">
                <Database size={64} weight="light" className="mb-6 opacity-20" />
                <p className="text-xl font-medium text-gray-400">No resources found</p>
                <p className="text-sm mt-2">Adjust your filters or add a new record.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 bg-black/20 border-t border-white/5 flex items-center justify-between">
              <p className="text-xs text-gray-500 font-mono">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, displayedResources.length)} of {displayedResources.length}
              </p>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={clsx(
                        "w-8 h-8 rounded-full text-xs font-bold transition-colors font-mono",
                        currentPage === i + 1 ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-500 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="glass-panel p-1.5 w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="glass-inner rounded-[calc(2rem-0.375rem)] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{editingResource ? 'Edit Resource' : 'Add New Resource'}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                    <X size={20} weight="bold" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  {formError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center font-medium">
                      <Warning size={18} weight="fill" className="mr-3 shrink-0" />
                      {formError}
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Resource Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                      placeholder="e.g., Thermal Blankets"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Category</label>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value as any})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                      >
                        <option value="Water">Water</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Food">Food</option>
                        <option value="Fuel">Fuel</option>
                        <option value="Blankets">Blankets</option>
                        <option value="Shelter">Shelter</option>
                        <option value="Rescue Equipment">Rescue Equipment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Quantity</label>
                      <input 
                        type="number" 
                        value={formData.quantity} 
                        onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm font-mono shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Priority</label>
                      <select 
                        value={formData.priority}
                        onChange={e => setFormData({...formData, priority: e.target.value as any})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                      >
                        <option value="Critical">Critical (5)</option>
                        <option value="High">High (4)</option>
                        <option value="Medium">Medium (3)</option>
                        <option value="Low">Low (2)</option>
                        <option value="Very Low">Very Low (1)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Status</label>
                      <select 
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value as any})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                      >
                        <option value="Available">Available</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Depleted">Depleted</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-8 flex justify-end space-x-4 border-t border-white/5">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-full font-bold text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                      Cancel
                    </button>
                    <button type="submit" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-[0.98]">
                      {editingResource ? 'Save Changes' : 'Confirm'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
