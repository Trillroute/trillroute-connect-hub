
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const CourseCurriculumTab = () => (
  <div className="space-y-4">
    <div>
      <h3 className="text-xl font-semibold mb-2">Course Content</h3>
      <p className="text-gray-600 mb-4">
        This course is structured to provide progressive learning from basic to advanced concepts.
      </p>
      
      <div className="space-y-2">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg">Module 1: Introduction</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg">Module 2: Core Techniques</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-lg">Module 3: Advanced Applications</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  </div>
);
