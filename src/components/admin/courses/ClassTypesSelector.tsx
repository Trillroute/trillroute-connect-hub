
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ClassTypeData } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Plus, Minus } from "lucide-react";

interface ClassType {
  id: string;
  name: string;
  description: string;
}

interface Props {
  value: ClassTypeData[];
  onChange: (data: ClassTypeData[]) => void;
}

const ClassTypesSelector: React.FC<Props> = ({ value, onChange }) => {
  const { toast } = useToast();
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [addId, setAddId] = useState<string>("");
  const [addQty, setAddQty] = useState<number>(1);

  useEffect(() => {
    const fetchClassTypes = async () => {
      const { data, error } = await supabase
        .from("class_types")
        .select("id, name, description")
        .order("name");

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load class types.",
          variant: "destructive",
        });
      } else {
        setClassTypes(data || []);
      }
    };

    fetchClassTypes();
  }, [toast]);

  const handleAdd = () => {
    if (!addId || !addQty || addQty < 1) return;
    if (value.some(ct => ct.class_type_id === addId)) {
      toast({
        title: "Class type already added",
        description: "Please adjust the quantity in the table below.",
        variant: "destructive",
      });
      return;
    }
    onChange([...value, { class_type_id: addId, quantity: addQty }]);
    setAddId("");
    setAddQty(1);
  };

  const handleRemove = (id: string) => {
    onChange(value.filter(ct => ct.class_type_id !== id));
  };

  const handleQtyChange = (id: string, qty: number) => {
    if (qty < 1) return;
    onChange(value.map(ct => ct.class_type_id === id ? { ...ct, quantity: qty } : ct));
  };

  return (
    <div className="space-y-2">
      <label className="font-medium">Select Class Types for this Course</label>
      <div className="flex items-end gap-2">
        <select
          className="border rounded px-2 py-1 flex-1"
          value={addId}
          onChange={e => setAddId(e.target.value)}
        >
          <option value="">Select class type...</option>
          {classTypes
            .filter(ct => !value.some(val => val.class_type_id === ct.id))
            .map(ct => (
              <option key={ct.id} value={ct.id}>
                {ct.name}
              </option>
            ))}
        </select>
        <Input
          type="number"
          min={1}
          className="w-20"
          value={addQty}
          onChange={e => setAddQty(Number(e.target.value))}
        />
        <Button type="button" variant="outline" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {value.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Class Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {value.map(ctData => {
              const ct = classTypes.find(c => c.id === ctData.class_type_id);
              return (
                <TableRow key={ctData.class_type_id}>
                  <TableCell>{ct?.name || ctData.class_type_id}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={ctData.quantity}
                      onChange={e => handleQtyChange(ctData.class_type_id, Number(e.target.value))}
                      className="w-16"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemove(ctData.class_type_id)}
                      size="icon"
                      className="ml-2"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      <p className="text-sm text-muted-foreground">
        You can add multiple class types for this course and specify how many of each.
      </p>
    </div>
  );
};

export default ClassTypesSelector;
