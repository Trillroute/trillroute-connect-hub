
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
      return '#10B981';
    case 'break':
      return '#3B82F6';
    case 'office':
      return '#8B5CF6';
    case 'meeting':
      return '#F59E0B';
    case 'class setup':
      return '#F97316';
    case 'qc':
      return '#EC4899';
    default:
      return '#10B981';
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
