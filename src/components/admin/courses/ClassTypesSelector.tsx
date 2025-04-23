
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { ClassTypeData } from '@/types/course';
import { useClassTypes } from '@/hooks/useClassTypes';

interface ClassTypesSelectorProps {
  value: ClassTypeData[];
  onChange: (value: ClassTypeData[]) => void;
}

const ClassTypesSelector: React.FC<ClassTypesSelectorProps> = ({ value, onChange }) => {
  const { classTypes = [] } = useClassTypes();

  const handleQuantityChange = (classTypeId: string, newQuantity: number) => {
    const currentValue = [...value];
    const existingIndex = currentValue.findIndex(ct => ct.class_type_id === classTypeId);

    if (newQuantity <= 0) {
      // Remove the class type if quantity is 0 or negative
      if (existingIndex !== -1) {
        currentValue.splice(existingIndex, 1);
      }
    } else {
      // Update or add the class type
      if (existingIndex !== -1) {
        currentValue[existingIndex].quantity = newQuantity;
      } else {
        currentValue.push({ class_type_id: classTypeId, quantity: newQuantity });
      }
    }

    onChange(currentValue);
  };

  const getQuantityForClassType = (classTypeId: string): number => {
    return value.find(ct => ct.class_type_id === classTypeId)?.quantity || 0;
  };

  return (
    <div className="space-y-4">
      <Label>Select Class Types for this Course</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classTypes.map((classType) => {
          const quantity = getQuantityForClassType(classType.id);
          return (
            <Card key={classType.id} className={`${quantity > 0 ? 'border-music-500' : ''}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{classType.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {classType.duration_value} {classType.duration_metric}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ₹{classType.price_inr} • Max {classType.max_students} students
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(classType.id, quantity - 1)}
                      disabled={quantity === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(classType.id, parseInt(e.target.value) || 0)}
                      className="w-20 text-center"
                      min="0"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(classType.id, quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        )}
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
