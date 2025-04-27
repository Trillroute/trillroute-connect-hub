
import React, { useState, useEffect } from 'react';
import { Lead } from '@/types/lead';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, MoveVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type StatusColumn = {
  key: string;
  label: string;
};

const STATUS_COLUMNS: StatusColumn[] = [
  { key: 'New', label: 'New' },
  { key: 'Contacted', label: 'Contacted' },
  { key: 'Interested', label: 'Interested' },
  { key: 'Take admission', label: 'Take Admission' },
  { key: 'Converted', label: 'Converted' },
  { key: 'Lost', label: 'Lost' },
];

interface LeadKanbanBoardProps {
  leads: Lead[];
  loading: boolean;
  onEdit?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
}

const LeadKanbanBoard: React.FC<LeadKanbanBoardProps> = ({
  leads = [], // Default to empty array if undefined
  loading = false, // Default to false if undefined
  onEdit,
  onDelete
}) => {
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localLeads, setLocalLeads] = useState<Lead[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Only update local state when leads is defined and valid
    if (Array.isArray(leads)) {
      setLocalLeads(leads);
    } else {
      setLocalLeads([]);
    }
  }, [leads]);

  if (loading) {
    return (
      <div className="flex w-full gap-4 overflow-x-auto pb-4">
        {STATUS_COLUMNS.map(column => (
          <div key={column.key} className="min-w-[270px] flex-1">
            <Card className="bg-muted/40 border-0 shadow-none">
              <CardTitle className="text-center py-2 font-semibold text-base">{column.label}</CardTitle>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  // Initialize leadsByStage with empty arrays for each status
  const leadsByStage: { [stage: string]: Lead[] } = {};
  STATUS_COLUMNS.forEach(s => leadsByStage[s.key] = []);
  
  // Safely categorize leads by stage
  if (Array.isArray(localLeads)) {
    localLeads.forEach(lead => {
      if (lead && typeof lead === 'object') {
        const stageKey = lead.stage || 'New';
        
        if (leadsByStage[stageKey]) {
          leadsByStage[stageKey].push(lead);
        } else {
          leadsByStage['New'].push(lead);
        }
      }
    });
  }

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    
    if (!draggedLead || draggedLead.stage === newStage) {
      setIsDragging(false);
      setDraggedLead(null);
      return;
    }
    
    // Update local state optimistically
    setLocalLeads(prev => 
      Array.isArray(prev) ? prev.map(lead => 
        lead.id === draggedLead.id 
          ? { ...lead, stage: newStage as Lead['stage'] } 
          : lead
      ) : []
    );
    
    try {
      const { error } = await supabase
        .from('leads')
        .update({ stage: newStage })
        .eq('id', draggedLead.id);
      
      if (error) throw error;
      
      toast({
        title: "Lead Updated",
        description: `Lead moved to ${STATUS_COLUMNS.find(s => s.key === newStage)?.label}`,
      });
    } catch (error) {
      console.error('Error updating lead:', error);
      
      // Revert to original state on error
      if (Array.isArray(leads)) {
        setLocalLeads(leads);
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update lead stage. Please try again.",
      });
    } finally {
      setIsDragging(false);
      setDraggedLead(null);
    }
  };

  return (
    <div className="flex w-full gap-4 overflow-x-auto pb-4">
      {STATUS_COLUMNS.map(column => (
        <div 
          key={column.key} 
          className="min-w-[270px] flex-1"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.key)}
        >
          <Card className={`bg-muted/40 border-0 shadow-none ${isDragging ? 'border-dashed border-2' : ''}`}>
            <CardTitle className="text-center py-2 font-semibold text-base">{column.label}</CardTitle>
            <CardContent>
              <div className="flex flex-col gap-3 min-h-[100px]">
                {(leadsByStage[column.key]?.length || 0) === 0 && (
                  <div className="text-xs text-gray-400 text-center py-4">No leads</div>
                )}
                {leadsByStage[column.key]?.map(lead => (
                  <div
                    key={lead.id}
                    className={`bg-white rounded-lg shadow border p-3 flex flex-col gap-2 hover:shadow-md animate-fade-in cursor-move ${
                      draggedLead?.id === lead.id ? 'opacity-50' : ''
                    }`}
                    draggable
                    onDragStart={() => handleDragStart(lead)}
                  >
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-xs text-gray-500">{lead.email}</div>
                    {lead.phone && (
                      <div className="text-xs text-gray-500">{lead.phone}</div>
                    )}
                    <div className="flex justify-between items-center mt-2 gap-2">
                      <span className="text-gray-400 text-xs">{lead.source || 'Unspecified'}</span>
                      <div className="flex space-x-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 rounded-full group"
                          title="Drag to move"
                        >
                          <MoveVertical className="w-3 h-3 text-gray-400" />
                          <span className="sr-only">Drag to move</span>
                        </Button>
                        {onEdit && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onEdit(lead)}
                            className="h-6 w-6 rounded-full group"
                          >
                            <Pencil className="w-3 h-3 group-hover:text-primary" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDelete(lead)}
                            className="h-6 w-6 rounded-full group"
                          >
                            <Trash2 className="w-3 h-3 group-hover:text-red-600" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default LeadKanbanBoard;
