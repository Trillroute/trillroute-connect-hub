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
import { Pencil, Trash2, Eye, Image } from "lucide-react";
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClassTypes.map((classType) => (
              <div 
                key={classType.id}
                className="bg-muted rounded-lg shadow p-4 flex flex-col transition hover:shadow-md min-h-[210px] h-full"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-shrink-0 rounded overflow-hidden bg-gray-100 border w-12 h-12 flex items-center justify-center">
                    {classType.image ? (
                      <img
                        src={classType.image}
                        alt={classType.name}
                        className="object-cover w-12 h-12"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = placeholderImage;
                        }}
                      />
                    ) : (
                      <Image className="text-gray-300 w-7 h-7" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate text-base" title={classType.name}>
                      {classType.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate" title={classType.description}>
                      {classType.description}
                    </div>
                  </div>
                  {classType.location && (
                    <Badge
                      variant="outline"
                      className="ml-1 px-2 py-0 text-xs max-w-[5rem] truncate"
                      title={classType.location}
                    >
                      {classType.location}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center text-xs text-gray-600 gap-4 mb-2">
                  <span>
                    <span className="text-gray-500">Duration:</span>{" "}
                    {classType.duration_value
                      ? `${classType.duration_value} ${classType.duration_metric}`
                      : `Unlimited ${classType.duration_metric}`}
                  </span>
                  <span>|</span>
                  <span>
                    <span className="text-gray-500">Max:</span>{" "}
                    {classType.max_students}
                  </span>
                </div>
                <div className="flex-1" />
                <div className="flex justify-between items-end mt-2">
                  <span className="text-sm font-semibold text-music-500">
                    {formatPrice(classType.price_inr)}
                  </span>
                  <div className="flex gap-1">
                    {onViewClassType && (
                      <Button
                        variant="ghost"
                        size="icon"
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
                      size="icon"
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
                        size="icon"
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
          <div className="flex flex-wrap gap-4">
            {filteredClassTypes.map((classType) => (
              <div
                key={classType.id}
                className="w-56 bg-muted rounded-lg shadow p-4 flex flex-col items-center justify-between min-h-[200px]"
              >
                <div className="mb-2 w-full flex flex-col items-center">
                  <div className="rounded bg-gray-100 border w-12 h-12 flex items-center justify-center mb-2 overflow-hidden">
                    {classType.image ? (
                      <img
                        src={classType.image}
                        alt={classType.name}
                        className="object-cover w-12 h-12"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = placeholderImage;
                        }}
                      />
                    ) : (
                      <Image className="text-gray-300 w-7 h-7" />
                    )}
                  </div>
                  <div className="font-semibold text-base truncate w-full text-center" title={classType.name}>
                    {classType.name}
                  </div>
                  <div className="text-xs text-gray-500 text-center truncate w-full" title={classType.description}>
                    {classType.description}
                  </div>
                  {classType.location && (
                    <Badge
                      variant="outline"
                      className="mt-1 px-2 py-0 text-xs max-w-[8rem] truncate"
                      title={classType.location}
                    >
                      {classType.location}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1 w-full">
                  <span className="text-xs text-gray-600">
                    <span className="text-gray-500">Duration:</span>{" "}
                    {classType.duration_value
                      ? `${classType.duration_value} ${classType.duration_metric}`
                      : `Unlimited ${classType.duration_metric}`}
                  </span>
                  <span className="text-xs text-gray-500">
                    Max: {classType.max_students}
                  </span>
                  <span className="text-sm font-semibold text-music-500">
                    {formatPrice(classType.price_inr)}
                  </span>
                </div>
                <div className="flex gap-1 justify-center mt-2 w-full">
                  {onViewClassType && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewClassType(classType)}
                      className="h-8 w-8"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditClassType(classType)}
                    className="h-8 w-8"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {onDeleteClassType && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteClassType(classType)}
                      className="h-8 w-8"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
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
