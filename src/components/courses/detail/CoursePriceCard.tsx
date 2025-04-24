
import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CoursePriceCardProps {
  course: Course;
  onEnroll: () => void;
}

export const CoursePriceCard = ({ course, onEnroll }: CoursePriceCardProps) => (
  <Card className="sticky top-8">
    <CardHeader>
      <CardTitle>Course Details</CardTitle>
      <CardDescription>Enrollment information</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {course.image && (
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-48 object-cover rounded-md mb-4"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      )}
      
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Price:</span>
        <span className="text-2xl font-bold text-music-600">
          ₹{course.final_price || course.base_price || 0}
        </span>
      </div>
      
      {course.discount_value > 0 && (
        <div className="flex items-center">
          <span className="line-through text-gray-500 mr-2">₹{course.base_price}</span>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            {course.discount_metric === 'percentage'
              ? `${course.discount_value}% OFF`
              : `₹${course.discount_value} OFF`}
          </Badge>
        </div>
      )}
      
      <div className="pt-4">
        <Button onClick={onEnroll} className="w-full bg-music-500 hover:bg-music-600">
          Enroll Now
        </Button>
      </div>
    </CardContent>
    <CardFooter className="flex flex-col items-start pt-0">
      <div className="text-sm text-gray-500 mt-4">
        <p>• Access to all course materials</p>
        <p>• Certificate of completion</p>
        <p>• Lifetime access to updates</p>
      </div>
    </CardFooter>
  </Card>
);
