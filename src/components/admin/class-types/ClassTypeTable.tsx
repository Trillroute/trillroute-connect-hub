
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ClassType {
  id: string;
  name: string;
  description: string;
  duration_metric: string;
  duration_value: number | null;
  max_students: number;
  price_inr: number;
  created_at: string;
}

const ClassTypeTable: React.FC = () => {
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchClassTypes = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from("class_types")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Error fetching class types:", error);
          toast({
            title: "Error",
            description: "Failed to load class types. " + error.message,
            variant: "destructive"
          });
        } else if (data) {
          setClassTypes(data as ClassType[]);
        }
      } catch (error) {
        console.error("Exception when fetching class types:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while fetching class types.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchClassTypes();
  
      // Set up realtime subscription
      const channel = supabase
        .channel("public:class_types")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "class_types" },
          () => fetchClassTypes()
        )
        .subscribe();
  
      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setLoading(false);
    }
  }, [user, toast]);

  if (!user) {
    return <div className="py-4 text-center text-gray-500">Please log in to view class types.</div>;
  }

  if (loading) {
    return <div className="py-4 text-center text-gray-500">Loading class types...</div>;
  }

  if (classTypes.length === 0) {
    return <div className="py-6 text-center text-gray-500">No class types found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Max Students</TableHead>
          <TableHead>Price (INR)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {classTypes.map((ct) => (
          <TableRow key={ct.id}>
            <TableCell>{ct.name}</TableCell>
            <TableCell>{ct.description}</TableCell>
            <TableCell>
              {ct.duration_value !== null
                ? `${ct.duration_value} ${ct.duration_metric}`
                : ct.duration_metric}
            </TableCell>
            <TableCell>{ct.max_students}</TableCell>
            <TableCell>{ct.price_inr}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClassTypeTable;
