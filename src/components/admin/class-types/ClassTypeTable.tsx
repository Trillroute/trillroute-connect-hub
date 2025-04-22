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

const placeholderImage = "/placeholder.svg";

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
  const searchTerm = searchQuery || localSearchTerm;

  const filteredClassTypes = classTypes && classTypes.length > 0 
    ? classTypes.filter((classType) => {
        const searchRegex = new RegExp(searchTerm, "i");
        return searchRegex.test(classType.name) || 
               searchRegex.test(classType.description) || 
               searchRegex.test(classType.duration_metric) ||
               (classType.location && searchRegex.test(classType.location));
      })
    : [];

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

  // Enhanced Grid View
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClassTypes.map((classType) => (
              <div 
                key={classType.id}
                className="rounded-xl shadow-md bg-card border transition hover:shadow-lg flex flex-col overflow-hidden h-[320px]"
              >
                <div className="h-[110px] w-full flex items-center justify-center bg-muted relative border-b">
                  {classType.image ? (
                    <img
                      src={classType.image}
                      alt={classType.name}
                      className="object-cover w-full h-full rounded-t-xl"
                      style={{ objectFit: "cover", height: "100%", width: "100%" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = placeholderImage;
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm bg-muted-foreground/5 select-none">
                      <img
                        src={placeholderImage}
                        alt="No Image"
                        className="w-10 h-10 opacity-40"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 justify-between p-4 gap-3">
                  <div>
                    <h3 className="font-semibold text-lg truncate mb-1" title={classType.name}>
                      {classType.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 min-h-[2em]" title={classType.description}>
                      {classType.description}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Duration:</span>
                      <span>
                        {classType.duration_value
                          ? `${classType.duration_value} ${classType.duration_metric}`
                          : `Unlimited ${classType.duration_metric}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Max Students:</span>
                      <span>{classType.max_students}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-medium">{formatPrice(classType.price_inr)}</span>
                    </div>
                    {classType.location && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Location:</span>
                        <Badge variant="outline" className="text-xs truncate max-w-[120px]">{classType.location}</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    {onViewClassType && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewClassType(classType)}
                        title="View details"
                        className="h-8 w-8"
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
                      className="h-8 w-8"
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
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          Showing {filteredClassTypes.length} of {classTypes ? classTypes.length : 0} class types
        </div>
      </div>
    );
  }

  // Enhanced Tile View
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredClassTypes.map((classType) => (
              <div
                key={classType.id}
                className="rounded-xl shadow-lg bg-card border transition hover:shadow-xl flex flex-col h-[250px] overflow-hidden"
              >
                <div className="h-[80px] w-full flex items-center justify-center bg-muted border-b relative">
                  {classType.image ? (
                    <img
                      src={classType.image}
                      alt={classType.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = placeholderImage;
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm bg-muted-foreground/5 select-none">
                      <img
                        src={placeholderImage}
                        alt="No Image"
                        className="w-8 h-8 opacity-50"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 justify-between p-3 gap-2">
                  <div>
                    <h3 className="font-semibold truncate mb-1" title={classType.name}>{classType.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1 min-h-[1.25em]" title={classType.description}>{classType.description}</p>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-medium">{formatPrice(classType.price_inr)}</span>
                  </div>
                  <div className="flex items-center mt-auto gap-2 justify-end pt-2">
                    {onViewClassType && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewClassType(classType)}
                        className="h-8 w-8"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditClassType(classType)}
                      className="h-8 w-8"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {onDeleteClassType && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteClassType(classType)}
                        className="h-8 w-8"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          Showing {filteredClassTypes.length} of {classTypes ? classTypes.length : 0} class types
        </div>
      </div>
    );
  }

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
        Showing {filteredClassTypes.length} of {classTypes ? classTypes.length : 0} class types
      </div>
    </div>
  );
};

export default ClassTypeTable;
