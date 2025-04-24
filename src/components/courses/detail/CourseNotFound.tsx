
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { memo } from "react";

export const CourseNotFound = memo(() => (
  <div className="container mx-auto px-4 py-12 text-center animate-in fade-in duration-300">
    <div className="py-12 bg-gray-50 rounded-lg">
      <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
      <p className="text-gray-600 mb-6">
        The course you're looking for doesn't exist or has been removed.
      </p>
      <Link to="/courses">
        <Button>Browse All Courses</Button>
      </Link>
    </div>
  </div>
));

CourseNotFound.displayName = 'CourseNotFound';
