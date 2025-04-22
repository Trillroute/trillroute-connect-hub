
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LayoutGrid, Grid2x2, LayoutList, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'tile'>('list');

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

  useEffect(() => {
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

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={viewMode === 'list' ? "secondary" : "outline"}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <LayoutList className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'grid' ? "secondary" : "outline"}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'tile' ? "secondary" : "outline"}
            onClick={() => setViewMode('tile')}
            title="Tile view"
          >
            <Grid2x2 className="w-4 h-4" />
          </Button>
        </div>
        <Button size="sm" variant="outline" onClick={fetchClassTypes}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      {loading ? (
        <div className="py-4 text-center text-gray-500">Loading class types...</div>
      ) : classTypes.length === 0 ? (
        <div className="py-6 text-center text-gray-500">No class types found.</div>
      ) : viewMode === 'list' ? (
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
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classTypes.map((ct) => (
            <div key={ct.id} className="bg-muted rounded-lg shadow p-4 flex flex-col">
              <div className="font-semibold">{ct.name}</div>
              <div className="text-xs text-gray-500 mb-2">{ct.duration_value !== null
                ? `${ct.duration_value} ${ct.duration_metric}` : ct.duration_metric}</div>
              <div className="text-sm truncate">{ct.description}</div>
              <div className="mt-2 text-xs">Max students: <b>{ct.max_students}</b></div>
              <div className="text-xs">Price (INR): <b>{ct.price_inr}</b></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {classTypes.map((ct) => (
            <div key={ct.id} className="w-56 bg-muted rounded-lg shadow p-4 flex flex-col items-center">
              <div className="font-semibold">{ct.name}</div>
              <div className="text-xs text-gray-500 mb-2">{ct.duration_value !== null
                ? `${ct.duration_value} ${ct.duration_metric}` : ct.duration_metric}</div>
              <div className="text-sm truncate text-center">{ct.description}</div>
              <div className="mt-2 text-xs">Max students: <b>{ct.max_students}</b></div>
              <div className="text-xs">Price (INR): <b>{ct.price_inr}</b></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassTypeTable;
