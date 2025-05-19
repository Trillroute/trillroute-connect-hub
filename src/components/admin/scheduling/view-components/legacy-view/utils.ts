
// Utility functions for the legacy view

// Format time for display
export const formatTime = (hour: number, minute: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
};

// Get category color
export const getCategoryColor = (category: string): string => {
  switch(category.toLowerCase()) {
    case 'session':
      return '#10B981'; // green-700
    case 'break':
      return '#3B82F6'; // blue-600
    case 'office':
      return '#8B5CF6'; // purple-600
    case 'meeting':
      return '#F59E0B'; // yellow-500
    case 'class setup':
      return '#F97316'; // orange-500
    case 'qc':
      return '#EC4899'; // pink-600
    default:
      return '#10B981'; // Default to green
  }
};

// Get category background class - for consistent styling with week view
export const getCategoryBackgroundClass = (category: string) => {
  switch (category.toLowerCase()) {
    case 'session':
      return 'bg-green-100 border-green-300 text-green-800';
    case 'break':
      return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'office':
      return 'bg-purple-100 border-purple-300 text-purple-800';
    case 'meeting':
      return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    case 'class setup':
      return 'bg-orange-100 border-orange-300 text-orange-800';
    case 'qc':
      return 'bg-pink-100 border-pink-300 text-pink-800';
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800';
  }
};

// Get item background style based on status/category
export const getItemStyle = (item: { status: string; color: string }) => {
  if (item.status === 'expired') {
    return 'bg-red-700/90 text-white';
  }
  
  if (item.status === 'booked') {
    return `bg-blue-600 text-white`;
  }
  
  return 'bg-green-700 text-white';
};
