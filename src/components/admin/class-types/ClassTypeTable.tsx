
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export interface ClassType {
  id: string;
  name: string;
  description: string;
  duration_metric: string;
  duration_value?: number | null;
  price_inr: number;
  max_students: number;
  location?: string;
  image?: string | null;
}

interface ClassTypeTableProps {
  classTypes: ClassType[];
  loading: boolean;
  onEditClassType: (classType: ClassType) => void;
  onViewClassType?: (classType: ClassType) => void;
  onDeleteClassType?: (classType: ClassType) => void;
  viewMode?: "list" | "grid" | "tile";
  searchQuery?: string;
}

const ClassTypeTable = ({
  classTypes,
  loading,
  onEditClassType,
  onViewClassType,
  onDeleteClassType,
  viewMode = "list",
  searchQuery = "",
}: ClassTypeTableProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  
  // Use either the prop searchQuery or local search state
  const searchTerm = searchQuery || localSearchTerm;
  
  const filteredClassTypes = classTypes.filter((classType) => {
    const searchRegex = new RegExp(searchTerm, "i");
    return searchRegex.test(classType.name) || 
           searchRegex.test(classType.description) || 
           searchRegex.test(classType.duration_metric) ||
           (classType.location && searchRegex.test(classType.location));
  });
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  if (loading) {
    return (
      <div>
        <Skeleton className="h-10 w-full mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Render grid view if viewMode is grid
  if (viewMode === "grid") {
    return (
      <div className="space-y-4">
        {!searchQuery && (
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search class types..."
              className="pl-9"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
          </div>
        )}

        {filteredClassTypes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "No class types found matching your search." : "No class types available."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClassTypes.map((classType) => (
              <div 
                key={classType.id} 
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{classType.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{classType.description}</p>
                  </div>
                  {classType.image && (
                    <div className="h-12 w-12 relative">
                      <img 
                        src={classType.image} 
                        alt={classType.name} 
                        className="h-12 w-12 object-cover rounded-md border" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Duration:</span>
                    <span className="text-sm">
                      {classType.duration_value 
                        ? `${classType.duration_value} ${classType.duration_metric}` 
                        : `Unlimited ${classType.duration_metric}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Max Students:</span>
                    <span className="text-sm">{classType.max_students}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Price:</span>
                    <span className="text-sm font-medium">{formatPrice(classType.price_inr)}</span>
                  </div>
                  
                  {classType.location && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Location:</span>
                      <Badge variant="outline" className="text-xs">{classType.location}</Badge>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  {onViewClassType && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewClassType(classType)}
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditClassType(classType)}
                    title="Edit class type"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  {onDeleteClassType && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteClassType(classType)}
                      title="Delete class type"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          Showing {filteredClassTypes.length} of {classTypes.length} class types
        </div>
      </div>
    );
  }
  
  // Render tile view if viewMode is tile
  if (viewMode === "tile") {
    return (
      <div className="space-y-4">
        {!searchQuery && (
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search class types..."
              className="pl-9"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
          </div>
        )}
        
        {filteredClassTypes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "No class types found matching your search." : "No class types available."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredClassTypes.map((classType) => (
              <div 
                key={classType.id} 
                className="border rounded-lg overflow-hidden flex flex-col h-[220px]"
              >
                <div 
                  className="h-24 bg-gray-100 relative"
                >
                  {classType.image ? (
                    <img 
                      src={classType.image} 
                      alt={classType.name} 
                      className="h-full w-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                
                <div className="p-3 flex-grow flex flex-col">
                  <div>
                    <h3 className="font-medium truncate" title={classType.name}>{classType.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1" title={classType.description}>{classType.description}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">Price:</span>
                    <span className="text-xs font-medium">{formatPrice(classType.price_inr)}</span>
                  </div>
                  
                  <div className="mt-auto pt-2 flex justify-end space-x-1">
                    {onViewClassType && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewClassType(classType)}
                        className="h-7 w-7 p-0"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditClassType(classType)}
                      className="h-7 w-7 p-0"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    {onDeleteClassType && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteClassType(classType)}
                        className="h-7 w-7 p-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          Showing {filteredClassTypes.length} of {classTypes.length} class types
        </div>
      </div>
    );
  }

  // Default to list view (original implementation)
  return (
    <div className="space-y-4">
      {!searchQuery && (
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search class types..."
            className="pl-9"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
          />
        </div>
      )}

      {filteredClassTypes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? "No class types found matching your search." : "No class types available."}
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-16rem)] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Max Students</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Image</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClassTypes.map((classType) => (
                <TableRow key={classType.id} className="h-[80px]">
                  <TableCell className="font-medium">
                    <div className="truncate max-w-[200px]" title={classType.name}>
                      {classType.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]" title={classType.description}>
                      {classType.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    {classType.duration_value 
                      ? `${classType.duration_value} ${classType.duration_metric}` 
                      : `Unlimited ${classType.duration_metric}`}
                  </TableCell>
                  <TableCell>{classType.max_students}</TableCell>
                  <TableCell>{formatPrice(classType.price_inr)}</TableCell>
                  <TableCell>
                    {classType.location ? (
                      <Badge variant="outline" className="truncate max-w-[150px]" title={classType.location}>
                        {classType.location}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {classType.image ? (
                      <div className="h-12 w-12 relative">
                        <img 
                          src={classType.image} 
                          alt={classType.name} 
                          className="h-12 w-12 object-cover rounded-md border" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {onViewClassType && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewClassType(classType)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditClassType(classType)}
                        title="Edit class type"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      {onDeleteClassType && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteClassType(classType)}
                          title="Delete class type"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
      <div className="text-sm text-muted-foreground">
        Showing {filteredClassTypes.length} of {classTypes.length} class types
      </div>
    </div>
  );
};

export default ClassTypeTable;
