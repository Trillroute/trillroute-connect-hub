
import React from 'react';
import { Input } from '@/components/ui/input';
import { Column } from './types';

interface DataTableFiltersProps {
  column: Column;
  value: string;
  onChange: (value: string) => void;
}

const DataTableFilters: React.FC<DataTableFiltersProps> = ({
  column,
  value,
  onChange
}) => {
  if (!column.filterable) return null;

  return (
    <Input
      placeholder={`Filter ${column.label}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8"
    />
  );
};

export default DataTableFilters;
