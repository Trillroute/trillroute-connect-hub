
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

interface ClassTypesSelectorProps {
  value: ClassTypeData[];
  onChange: (value: ClassTypeData[]) => void;
}

const ClassTypesSelector: React.FC<ClassTypesSelectorProps> = ({ value, onChange }) => {
  const { classTypes = [] } = useClassTypes();

  const handleChange = (classTypeId: string, field: 'quantity' | 'duration_value' | 'duration_metric', newValue: string | number) => {
    const currentValue = [...value];
    const existingIndex = currentValue.findIndex(ct => ct.class_type_id === classTypeId);

    if (field === 'quantity' && Number(newValue) <= 0) {
      if (existingIndex !== -1) {
        currentValue.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex !== -1) {
        currentValue[existingIndex] = {
          ...currentValue[existingIndex],
          [field]: field === 'duration_metric' ? newValue : Number(newValue),
        };
      } else {
        currentValue.push({ 
          class_type_id: classTypeId, 
          quantity: field === 'quantity' ? Number(newValue) : 1,
          duration_value: field === 'duration_value' ? Number(newValue) : 0,
          duration_metric: field === 'duration_metric' ? String(newValue) : 'minutes',
        });
      }
    }

    onChange(currentValue);
  };

  const getValueForClassType = (classTypeId: string, field: 'quantity' | 'duration_value' | 'duration_metric'): string | number => {
    const classType = value.find(ct => ct.class_type_id === classTypeId);
    if (!classType) return field === 'duration_metric' ? 'minutes' : 0;
    return classType[field] || (field === 'duration_metric' ? 'minutes' : 0);
  };

  return (
    <div className="space-y-4">
      <Label>Select Class Types for this Course</Label>
      <div className="space-y-4">
        {classTypes.map((classType) => {
          const quantity = getValueForClassType(classType.id, 'quantity');
          const durationValue = getValueForClassType(classType.id, 'duration_value');
          const durationMetric = getValueForClassType(classType.id, 'duration_metric');

          return (
            <div key={classType.id} className="border p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{classType.name}</h3>
                  <p className="text-sm text-muted-foreground">₹{classType.price_inr} • Max {classType.max_students} students</p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`quantity-${classType.id}`}>Quantity:</Label>
                  <Select
                    value={String(quantity)}
                    onValueChange={(val) => handleChange(classType.id, 'quantity', val)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Select quantity" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {quantity > 0 && (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor={`duration-value-${classType.id}`}>Duration Value</Label>
                    <Select
                      value={String(durationValue)}
                      onValueChange={(val) => handleChange(classType.id, 'duration_value', val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {[15, 30, 45, 60, 90, 120].map((num) => (
                          <SelectItem key={num} value={String(num)}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`duration-metric-${classType.id}`}>Duration Metric</Label>
                    <Select
                      value={String(durationMetric)}
                      onValueChange={(val) => handleChange(classType.id, 'duration_metric', val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select metric" />
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
              )}
            </div>
          );
        })}
      </div>
      {classTypes.length === 0 && (
        <div className="text-center text-muted-foreground py-4">
          No class types available
        </div>
      )}
    </div>
  );
};

export default ClassTypesSelector;
