
import { useState, useMemo } from 'react';

export interface ClientsFilters {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  segmentFilter: string;
  setSegmentFilter: (v: string) => void;
  lastContactFilter: string;
  setLastContactFilter: (v: string) => void;
  hasActiveFilters: boolean;
  clearAll: () => void;
}

export function useClientsFilters(): ClientsFilters {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [lastContactFilter, setLastContactFilter] = useState('all');
  
  const hasActiveFilters = useMemo(() =>
    statusFilter !== 'all' ||
    segmentFilter !== 'all' ||
    lastContactFilter !== 'all' ||
    searchTerm !== ''
  , [statusFilter, segmentFilter, lastContactFilter, searchTerm]);

  const clearAll = () => {
    setStatusFilter('all');
    setSegmentFilter('all');
    setLastContactFilter('all');
    setSearchTerm('');
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    segmentFilter,
    setSegmentFilter,
    lastContactFilter,
    setLastContactFilter,
    hasActiveFilters,
    clearAll,
  };
}
