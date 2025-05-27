
import React from 'react';

export const GroupCourseNotice: React.FC = () => {
  return (
    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
      <p className="text-sm text-amber-800">
        This is a recurring group course. You'll need to select a time slot where all teachers are available.
      </p>
    </div>
  );
};
