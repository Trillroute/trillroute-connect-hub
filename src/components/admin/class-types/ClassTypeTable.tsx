
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
}

const ClassTypeTable = ({
  classTypes,
  loading,
  onEditClassType,
  onViewClassType,
  onDeleteClassType,
}: ClassTypeTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
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

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search class types..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
