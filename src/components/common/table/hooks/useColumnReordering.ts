
import { useState } from 'react';
import { ColumnConfig } from '../types';

export const useColumnReordering = (
  initialColumnConfigs: ColumnConfig[], 
  onColumnReorder?: (draggedField: string, targetField: string) => void
) => {
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>(initialColumnConfigs);
  const [draggedColIndex, setDraggedColIndex] = useState<number | null>(null);

  // Column drag handlers
  const handleDragStart = (index: number) => {
    // Check if the column should be draggable
    const column = columnConfigs[index];
    
    // Define non-draggable columns
    const isNameColumn = 
      column.field === 'name' || 
      column.field === 'title' ||
      column.headerName === 'Name' ||
      column.headerName.includes('Name') ||
      index === 0;  // First column is usually a name/identifier
    
    if (isNameColumn || column.field.includes('action')) {
      return;
    }
    
    setDraggedColIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedColIndex === null || draggedColIndex === index) return;
    
    // Don't allow dropping on protected columns
    const targetColumn = columnConfigs[index];
    const isNameColumn = 
      targetColumn.field === 'name' || 
      targetColumn.field === 'title' ||
      targetColumn.headerName === 'Name' ||
      targetColumn.headerName.includes('Name') ||
      index === 0;  // First column is usually a name/identifier
    
    if (isNameColumn || targetColumn.field.includes('action')) {
      return;
    }

    // Create a new array with reordered columns
    const newColumnConfigs = [...columnConfigs];
    const draggedColumn = newColumnConfigs[draggedColIndex];
    
    // Remove the dragged column
    newColumnConfigs.splice(draggedColIndex, 1);
    // Insert it at the new position
    newColumnConfigs.splice(index, 0, draggedColumn);
    
    // Update the dragged column index
    setDraggedColIndex(index);
    // Update the column configs
    setColumnConfigs(newColumnConfigs);
    
    // If external reorder handler exists, call it
    if (onColumnReorder) {
      onColumnReorder(draggedColumn.field, targetColumn.field);
    }
  };

  const handleDragEnd = () => {
    setDraggedColIndex(null);
  };
  
  return {
    columnConfigs,
    setColumnConfigs,
    draggedColIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  };
};
