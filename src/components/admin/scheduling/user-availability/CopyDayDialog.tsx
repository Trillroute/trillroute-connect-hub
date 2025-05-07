
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { DayOption } from '@/hooks/availability/types';

interface CopyDayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  daysOfWeek: DayOption[];
  onCopyDay: (fromDay: number, toDay: number) => Promise<boolean>;
}

const CopyDayDialog: React.FC<CopyDayDialogProps> = ({
  open,
  onOpenChange,
  daysOfWeek,
  onCopyDay
}) => {
  const [fromDay, setFromDay] = useState<string>("");
  const [toDay, setToDay] = useState<string>("");
  const [isCopying, setIsCopying] = useState(false);
  
  const handleCopy = async () => {
    if (!fromDay || !toDay || fromDay === toDay) {
      return;
    }
    
    try {
      setIsCopying(true);
      const success = await onCopyDay(parseInt(fromDay), parseInt(toDay));
      
      if (success) {
        onOpenChange(false);
        // Reset form
        setFromDay("");
        setToDay("");
      }
    } finally {
      setIsCopying(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copy Day Schedule</DialogTitle>
          <DialogDescription>
            Copy availability time slots from one day to another
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="fromDay">Copy From</Label>
            <Select value={fromDay} onValueChange={setFromDay}>
              <SelectTrigger id="fromDay">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem 
                    key={`from-${day.dayOfWeek}`} 
                    value={day.dayOfWeek.toString()}
                  >
                    {day.dayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="toDay">Copy To</Label>
            <Select value={toDay} onValueChange={setToDay}>
              <SelectTrigger id="toDay">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek
                  .filter((day) => day.dayOfWeek.toString() !== fromDay)
                  .map((day) => (
                    <SelectItem 
                      key={`to-${day.dayOfWeek}`} 
                      value={day.dayOfWeek.toString()}
                    >
                      {day.dayName}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCopy} 
            disabled={isCopying || !fromDay || !toDay || fromDay === toDay}
          >
            {isCopying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Copying...
              </>
            ) : (
              "Copy"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CopyDayDialog;
