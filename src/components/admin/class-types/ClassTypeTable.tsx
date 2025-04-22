import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption,
  ResizablePanelGroup, ResizablePanel, ResizableHandle 
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import EditClassTypeDialog from "./EditClassTypeDialog";

interface ClassType {
  id: string;
  name: string;
  description: string;
  duration_metric: string;
  duration_value: number | null;
  max_students: number;
  price_inr: number;
  created_at: string;
  location: string;
  image?: string | null; // Make optional for backward compatibility
}

// Column options for table views
const COLUMN_OPTIONS = [
  { key: "name", label: "Class Type" },
  { key: "description", label: "Description" },
  { key: "duration", label: "Duration" },
  { key: "max_students", label: "Max Students" },
  { key: "price_inr", label: "Price (INR)" },
  { key: "location", label: "Location" },
  { key: "image", label: "Image" }
];

const DEFAULT_VISIBLE_COLUMNS = ["name", "description", "duration", "max_students", "price_inr", "location", "image"];

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClassType, setSelectedClassType] = useState<ClassType | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_VISIBLE_COLUMNS);
  const [columnDropdownOpen, setColumnDropdownOpen] = useState(false);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key)
        ? prev.filter((col) => col !== key)
        : [...prev, key]
    );
  };
  
  const handleDropdownBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setColumnDropdownOpen(false);
    }
  };

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

  useEffect(() => {
    setSelectedIds(prev => prev.filter(id => filteredClassTypes.some(ct => ct.id === id)));
  }, [filteredClassTypes]);

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const openEditDialog = (ct: ClassType) => {
    setSelectedClassType(ct);
    setEditDialogOpen(true);
  };

  const allSelected = filteredClassTypes.length > 0 && selectedIds.length === filteredClassTypes.length;
  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(filteredClassTypes.map(ct => ct.id));
  };
  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length > 0) {
      alert('Bulk delete for class types (implement logic):\n' + selectedIds.join(', '));
    }
  };

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
      <>
        <div className="flex items-center justify-between mb-2">
          {selectedIds.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="w-4 h-4 mr-1" />
              Delete Selected ({selectedIds.length})
            </Button>
          )}
          <div className="relative z-30">
            <button
              className="px-3 py-1 border rounded bg-white shadow-sm hover:bg-gray-50 focus:outline-none"
              onClick={() => setColumnDropdownOpen((open) => !open)}
              type="button"
            >
              Choose Columns
            </button>
            {columnDropdownOpen && (
              <div
                className="absolute right-0 mt-1 min-w-[180px] bg-white border rounded shadow-lg z-50 p-2"
                tabIndex={0}
                onBlur={handleDropdownBlur}
              >
                {COLUMN_OPTIONS.map((col) => (
                  <label key={col.key} className="flex items-center gap-2 cursor-pointer py-0.5">
                    <input
                      type="checkbox"
                      className="accent-indigo-600"
                      checked={visibleColumns.includes(col.key)}
                      onChange={() => toggleColumn(col.key)}
                    />
                    {col.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <ResizablePanelGroup direction="horizontal" className="w-full">
          <ResizablePanel minSize={6} defaultSize={6}>
            <Table>
              <TableCaption>A list of all class types in the system.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all class types"
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClassTypes.map(ct => (
                  <TableRow key={ct.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(ct.id)}
                        onCheckedChange={() => toggleSelectOne(ct.id)}
                        aria-label={`Select ${ct.name}`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ResizablePanel>
          <ResizableHandle withHandle isHeader />
          <ResizablePanel minSize={18} defaultSize={18}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[220px]">Class Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClassTypes.map(ct => (
                  <TableRow key={ct.id} className="cursor-pointer" onClick={() => openEditDialog(ct)}>
                    <TableCell className="font-medium max-w-[220px]">
                      <div className="truncate font-semibold">{ct.name}</div>
                      <div className="text-xs text-gray-500 md:hidden truncate">
                        {ct.duration_value !== null ? `${ct.duration_value} ${ct.duration_metric}` : ct.duration_metric}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ResizablePanel>
          
          {COLUMN_OPTIONS.filter((col) => col.key !== "name" && visibleColumns.includes(col.key)).map((col) => (
            <React.Fragment key={col.key}>
              <ResizableHandle withHandle isHeader />
              <ResizablePanel minSize={12} defaultSize={12}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden md:table-cell">{col.label}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClassTypes.map((ct) => (
                      <TableRow
                        key={ct.id}
                        className="cursor-pointer"
                        onClick={() => openEditDialog(ct)}
                      >
                        <TableCell className="hidden md:table-cell">
                          {col.key === "description" && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="block max-w-[200px]">
                                  <span className="truncate block">{truncateText(ct.description)}</span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[300px]">
                                  {ct.description}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {col.key === "duration" && (
                            ct.duration_value !== null
                              ? `${ct.duration_value} ${ct.duration_metric}`
                              : ct.duration_metric
                          )}
                          {col.key === "max_students" && ct.max_students}
                          {col.key === "price_inr" && ct.price_inr}
                          {col.key === "location" && ct.location}
                          {col.key === "image" && ct.image && (
                            <img
                              src={ct.image}
                              alt={ct.name}
                              className="w-14 h-14 object-cover rounded border"
                              onClick={e => e.stopPropagation()}
                            />
                          )}
                          {col.key === "image" && !ct.image && (
                            <span className="text-xs text-gray-400">No image</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResizablePanel>
            </React.Fragment>
          ))}
        </ResizablePanelGroup>
        <EditClassTypeDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          classType={selectedClassType}
          onSuccess={fetchClassTypes}
        />
      </>
    );
  }

  if (viewMode === "grid") {
    return (
      <>
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-end mb-2">
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="w-4 h-4 mr-1" />
              Delete Selected ({selectedIds.length})
            </Button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClassTypes.map(ct => (
            <div
              key={ct.id}
              className="bg-muted rounded-lg shadow p-4 flex flex-col h-full cursor-pointer relative"
              onClick={() => openEditDialog(ct)}
              tabIndex={0}
              role="button"
              aria-label={`Edit ${ct.name}`}
            >
              <div className="absolute top-4 right-4">
                <Checkbox
                  checked={selectedIds.includes(ct.id)}
                  onCheckedChange={() => toggleSelectOne(ct.id)}
                  aria-label={`Select ${ct.name}`}
                  onClick={e => e.stopPropagation()}
                />
              </div>
              {ct.image && (
                <img src={ct.image} alt={ct.name} className="w-28 h-28 object-cover rounded mb-1 mx-auto border" />
              )}
              <div className="flex flex-col gap-1">
                <div className="font-semibold text-lg line-clamp-1 w-full" title={ct.name}>{ct.name}</div>
                <div className="text-xs text-gray-500">
                  {ct.duration_value !== null ? `${ct.duration_value} ${ct.duration_metric}` : ct.duration_metric}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-sm block w-full">
                      <p className="line-clamp-3 text-sm text-left w-full break-words">{ct.description}</p>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[250px]">
                      {ct.description}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="mt-auto pt-2 flex flex-row flex-wrap gap-x-6 gap-y-1 text-xs">
                <div>Max students: <b>{ct.max_students}</b></div>
                <div>Price: <b>&#8377;{ct.price_inr}</b></div>
              </div>
            </div>
          ))}
        </div>
        <EditClassTypeDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          classType={selectedClassType}
          onSuccess={fetchClassTypes}
        />
      </>
    );
  }

  return (
    <>
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-end mb-2">
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="w-4 h-4 mr-1" />
            Delete Selected ({selectedIds.length})
          </Button>
        </div>
      )}
      <div className="flex flex-wrap gap-4">
        {filteredClassTypes.map(ct => (
          <div
            key={ct.id}
            className="w-56 bg-muted rounded-lg shadow p-4 flex flex-col items-center h-full cursor-pointer relative"
            onClick={() => openEditDialog(ct)}
            tabIndex={0}
            role="button"
            aria-label={`Edit ${ct.name}`}
          >
            <div className="absolute top-4 right-4">
              <Checkbox
                checked={selectedIds.includes(ct.id)}
                onCheckedChange={() => toggleSelectOne(ct.id)}
                aria-label={`Select ${ct.name}`}
                onClick={e => e.stopPropagation()}
              />
            </div>
            {ct.image && (
              <img src={ct.image} alt={ct.name} className="w-20 h-20 object-cover rounded mb-1 border" />
            )}
            <div className="font-semibold text-lg line-clamp-1 text-center w-full" title={ct.name}>{ct.name}</div>
            <div className="text-xs text-gray-500 mb-2">
              {ct.duration_value !== null ? `${ct.duration_value} ${ct.duration_metric}` : ct.duration_metric}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="text-sm text-center w-full">
                  <p className="line-clamp-3 text-sm text-center w-full break-words">{ct.description}</p>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px]">
                  {ct.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="mt-auto pt-2 text-xs">Max students: <b>{ct.max_students}</b></div>
            <div className="text-xs">Price (INR): <b>{ct.price_inr}</b></div>
          </div>
        ))}
      </div>
      <EditClassTypeDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        classType={selectedClassType}
        onSuccess={fetchClassTypes}
      />
    </>
  );
};

export type { ClassType };
export default ClassTypeTable;

// NOTE: This file is getting long; consider refactoring into smaller components.
