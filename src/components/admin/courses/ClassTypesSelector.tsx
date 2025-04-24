
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClassTypes } from '@/hooks/useClassTypes';

interface ClassTypeData {
  class_type_id: string;
  quantity: number;
  duration_value?: number;
  duration_metric?: string;
}

interface ClassTypesSelectorProps {
  value: ClassTypeData[];
  onChange: (value: ClassTypeData[]) => void;
}

const ClassTypesSelector: React.FC<ClassTypesSelectorProps> = ({ value = [], onChange }) => {
  const { classTypes, loading } = useClassTypes();
  const [selectedClassTypes, setSelectedClassTypes] = useState<ClassTypeData[]>(value);

  useEffect(() => {
    setSelectedClassTypes(value);
  }, [value]);

  const handleAddClassType = () => {
    if (classTypes.length === 0) return;
    
    // Default to first class type in the list if available
    const newClassTypeId = classTypes[0]?.id || "default_class_type";
    
    const newClassType: ClassTypeData = {
      class_type_id: newClassTypeId,
      quantity: 1,
      duration_value: 30,
      duration_metric: "minutes"
    };
    
    const updatedClassTypes = [...selectedClassTypes, newClassType];
    setSelectedClassTypes(updatedClassTypes);
    onChange(updatedClassTypes);
  };

  const handleRemoveClassType = (index: number) => {
    const updatedClassTypes = selectedClassTypes.filter((_, i) => i !== index);
    setSelectedClassTypes(updatedClassTypes);
    onChange(updatedClassTypes);
  };

  const handleChange = (index: number, field: keyof ClassTypeData, value: string | number) => {
    const updatedClassTypes = [...selectedClassTypes];
    updatedClassTypes[index] = {
      ...updatedClassTypes[index],
      [field]: value
    };
    setSelectedClassTypes(updatedClassTypes);
    onChange(updatedClassTypes);
  };

  if (loading) {
    return <div>Loading class types...</div>;
  }

  if (classTypes.length === 0) {
    return <div className="p-4 text-center">No class types available. Please create class types first.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-semibold">Class Types</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={handleAddClassType}
          className="flex items-center gap-1 text-xs"
        >
          <Plus className="h-3 w-3" />
          Add Class Type
        </Button>
      </div>
      
      <div className="space-y-3">
        {selectedClassTypes.map((classTypeData, index) => (
          <Card key={index} className="border border-gray-200">
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Class Type</Label>
                  <Select
                    value={classTypeData.class_type_id || "default_class_type"}
                    onValueChange={(val) => handleChange(index, 'class_type_id', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class type" />
                    </SelectTrigger>
                    <SelectContent>
                      {classTypes.map((classType) => (
                        <SelectItem key={classType.id} value={classType.id}>
                          {classType.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="default_class_type">Default Class Type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Quantity</Label>
                  <Select
                    value={String(classTypeData.quantity || 1)}
                    onValueChange={(val) => handleChange(index, 'quantity', Number(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quantity" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
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
                      value={String(classTypeData.duration_value || 30)}
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
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveClassType(index)}
                      className="h-10 w-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {selectedClassTypes.length === 0 && (
          <div className="text-center p-4 border border-dashed rounded-md text-gray-500">
            No class types added. Click "Add Class Type" to add one.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassTypesSelector;
