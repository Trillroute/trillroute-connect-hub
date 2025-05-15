
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
    case 'teaching':
      return '#10B981';
    case 'meeting':
      return '#3B82F6';
    case 'practice':
      return '#F59E0B';
    case 'performance':
      return '#8B5CF6';
    case 'session':
      return '#6366F1';
    case 'expired':
      return '#9B2C2C';
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
