
import { useCallback, useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseAgGridConfigProps<T> {
  onBulkDelete?: (ids: string[]) => void;
}

export function useAgGridConfig<T extends { id: string }>({
  onBulkDelete
}: UseAgGridConfigProps<T>) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Grid ready event handler to set default column settings
  const onGridReady = useCallback((params: any) => {
    try {
      console.log('AG Grid is ready:', params);
      if (params.api) {
        params.api.sizeColumnsToFit();
        // Force refresh the grid
        setTimeout(() => {
          params.api.redrawRows();
          console.log('AG Grid rows redrawn');
        }, 100);
      }
    } catch (err) {
      console.error('Error in onGridReady:', err);
      toast({
        title: "Grid initialization error",
        description: "There was an issue loading the table.",
        variant: "destructive"
      });
    }
  }, []);

  // Row selection change handler
  const onSelectionChanged = useCallback((event: any) => {
    console.log('Selection changed:', event);
    const selected = event.api.getSelectedRows().map((row: T) => row.id);
    setSelectedRows(selected);
  }, []);

  // Handle bulk delete action
  const handleBulkDelete = useCallback(() => {
    if (onBulkDelete && selectedRows.length > 0) {
      onBulkDelete(selectedRows);
      setSelectedRows([]);
    }
  }, [onBulkDelete, selectedRows]);

  return {
    selectedRows,
    onGridReady,
    onSelectionChanged,
    handleBulkDelete
  };
}
