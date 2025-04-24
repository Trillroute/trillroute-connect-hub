
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClassTypeData } from '@/types/course';
import { useClassTypes } from '@/hooks/useClassTypes';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface ClassTypesSelectorProps {
  value: ClassTypeData[];
  onChange: (value: ClassTypeData[]) => void;
}

const ClassTypesSelector: React.FC<ClassTypesSelectorProps> = ({ value, onChange }) => {
  const { classTypes = [] } = useClassTypes();

  const handleChange = (index: number, field: keyof ClassTypeData, newValue: string | number) => {
    const updatedValue = [...value];
    
    if (field === 'quantity' && typeof newValue === 'number' && newValue <= 0) {
      updatedValue.splice(index, 1);
    } else {
      updatedValue[index] = {
        ...updatedValue[index],
        [field]: newValue
      };
    }
    
    onChange(updatedValue);
  };

  const addClassType = () => {
    onChange([...value, {
      class_type_id: '',
      quantity: 1,
      duration_value: 30,
      duration_metric: 'minutes'
    }]);
  };

  const removeClassType = (index: number) => {
    const updatedValue = [...value];
    updatedValue.splice(index, 1);
    onChange(updatedValue);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Select Class Types for this Course</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addClassType}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Class Type
        </Button>
      </div>

      <div className="space-y-4">
        {value.map((classTypeData, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                <div>
                  <Label>Class Type</Label>
                  <Select
                    value={classTypeData.class_type_id || "_select_class_type"}
                    onValueChange={(val) => handleChange(index, 'class_type_id', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class type" />
                    </SelectTrigger>
                    <SelectContent>
                      {classTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id || "_default_type"}>
                          {type.name} (₹{type.price_inr})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Quantity</Label>
                  <Select
                    value={String(classTypeData.quantity) || "1"}
                    onValueChange={(val) => handleChange(index, 'quantity', Number(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quantity" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Duration</Label>
                  <div className="flex gap-2">
                    <Select
                      value={String(classTypeData.duration_value) || "30"}
                      onValueChange={(val) => handleChange(index, 'duration_value', Number(val))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {[15, 30, 45, 60, 90, 120].map((duration) => (
                          <SelectItem key={duration} value={String(duration)}>
                            {duration}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={classTypeData.duration_metric || "minutes"}
                      onValueChange={(val) => handleChange(index, 'duration_metric', val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Metric" />
                      </SelectTrigger>
                      <SelectContent>
                        {['minutes', 'hours', 'days', 'weeks', 'months'].map((metric) => (
                          <SelectItem key={metric} value={metric}>
                            {metric.charAt(0).toUpperCase() + metric.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeClassType(index)}
                className="ml-2"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>

            {classTypeData.class_type_id && (
              <div className="text-sm text-muted-foreground">
                {classTypes.find(ct => ct.id === classTypeData.class_type_id)?.description}
              </div>
            )}
          </div>
        ))}

        {value.length === 0 && (
          <div className="text-center text-muted-foreground py-8 border rounded-lg">
            No class types added. Click the button above to add one.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassTypesSelector;
