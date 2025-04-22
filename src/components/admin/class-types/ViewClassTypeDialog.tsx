
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClassType } from "./ClassTypeTable";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ViewClassTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classType: ClassType | null;
}

const ViewClassTypeDialog: React.FC<ViewClassTypeDialogProps> = ({
  open,
  onOpenChange,
  classType,
}) => {
  const placeholderImage = "/placeholder.svg";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  if (!classType) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Class Type Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-md overflow-hidden border">
                {classType.image ? (
                  <img
                    src={classType.image}
                    alt={classType.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = placeholderImage;
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">No image</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{classType.name}</h3>
                {classType.location && (
                  <Badge variant="outline" className="mt-1">
                    {classType.location}
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {classType.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Duration</h4>
                <p className="text-sm">
                  {classType.duration_value
                    ? `${classType.duration_value} ${classType.duration_metric}`
                    : `Unlimited ${classType.duration_metric}`}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Maximum Students</h4>
                <p className="text-sm">{classType.max_students}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Price</h4>
                <p className="text-sm font-semibold text-primary">
                  {formatPrice(classType.price_inr)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Created At</h4>
                <p className="text-sm">
                  {new Date(classType.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewClassTypeDialog;
