
import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
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

interface ClassTypeTableProps {
  viewMode?: "list" | "grid" | "tile";
  searchQuery?: string;
}

const ClassTypeTable: React.FC<ClassTypeTableProps> = ({
  viewMode = "list",
  searchQuery = "",
}) => {
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

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

  const filteredClassTypes = useMemo(() => {
    if (!searchQuery.trim()) return classTypes;
    const q = searchQuery.toLowerCase();
    return classTypes.filter(ct =>
      ct.name.toLowerCase().includes(q) ||
      ct.description.toLowerCase().includes(q) ||
      (ct.duration_metric && ct.duration_metric.toLowerCase().includes(q))
    );
  }, [classTypes, searchQuery]);

  if (!user) {
    return <div className="py-4 text-center text-gray-500">Please log in to view class types.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-music-500"></div>
      </div>
    );
  }

  if (!filteredClassTypes.length) {
    return (
      <div className="py-6 text-center text-gray-500">No class types found.</div>
    );
  }

  if (viewMode === "list") {
    return (
      <Table>
        <TableCaption>A list of all class types in the system.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[220px]">Class Type</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="hidden md:table-cell">Duration</TableHead>
            <TableHead className="hidden md:table-cell">Max Students</TableHead>
            <TableHead className="hidden md:table-cell">Price (INR)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClassTypes.map(ct => (
            <TableRow key={ct.id}>
              <TableCell className="font-medium max-w-[220px]">
                <div className="truncate font-semibold">{ct.name}</div>
                <div className="text-xs text-gray-500 md:hidden truncate">
                  {ct.duration_value !== null ? `${ct.duration_value} ${ct.duration_metric}` : ct.duration_metric}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell truncate">{ct.description}</TableCell>
              <TableCell className="hidden md:table-cell truncate">{ct.duration_value !== null ? `${ct.duration_value} ${ct.duration_metric}` : ct.duration_metric}</TableCell>
              <TableCell className="hidden md:table-cell">{ct.max_students}</TableCell>
              <TableCell className="hidden md:table-cell">{ct.price_inr}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClassTypes.map(ct => (
          <div key={ct.id} className="bg-muted rounded-lg shadow p-4 flex flex-col">
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-lg">{ct.name}</div>
              <div className="text-xs text-gray-500">{ct.duration_value !== null ? `${ct.duration_value} ${ct.duration_metric}` : ct.duration_metric}</div>
              <div className="text-sm truncate">{ct.description}</div>
            </div>
            <div className="mt-2 flex flex-row flex-wrap gap-x-6 gap-y-1 text-xs">
              <div>Max students: <b>{ct.max_students}</b></div>
              <div>Price: <b>&#8377;{ct.price_inr}</b></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // tile view
  return (
    <div className="flex flex-wrap gap-4">
      {filteredClassTypes.map(ct => (
        <div key={ct.id} className="w-56 bg-muted rounded-lg shadow p-4 flex flex-col items-center">
          <div className="font-semibold text-lg">{ct.name}</div>
          <div className="text-xs text-gray-500 mb-2">{ct.duration_value !== null ? `${ct.duration_value} ${ct.duration_metric}` : ct.duration_metric}</div>
          <div className="text-sm truncate text-center">{ct.description}</div>
          <div className="mt-2 text-xs">Max students: <b>{ct.max_students}</b></div>
          <div className="text-xs">Price (INR): <b>{ct.price_inr}</b></div>
        </div>
      ))}
    </div>
  );
};

export default ClassTypeTable;
