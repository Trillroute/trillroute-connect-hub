
// Utility functions for the legacy view

// Format time for display
export const formatTime = (hour: number, minute: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
};

// Get category color - EXACTLY matching weekViewUtils.ts colors
export const getCategoryColor = (category: string): string => {
  switch(category.toLowerCase()) {
    case 'session':
      return '#10B981'; // green-500 - same as week view
    case 'break':
      return '#3B82F6'; // blue-600 - same as week view
    case 'office':
      return '#8B5CF6'; // purple-600 - same as week view
    case 'meeting':
      return '#F59E0B'; // yellow-500 - same as week view
    case 'class setup':
      return '#F97316'; // orange-500 - same as week view
    case 'qc':
      return '#EC4899'; // pink-600 - same as week view
    default:
      return '#10B981'; // Default to green - same as week view
  }
};

// Get category background class - EXACTLY matching weekViewUtils.ts
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

// Get item background style based on status/category - EXACTLY matching week view logic
export const getItemStyle = (item: { status: string; color: string; type?: string }) => {
  // Handle expired status 
  if (item.status === 'expired') {
    return 'bg-red-700/90 text-white';
  }
  
  // Handle booked status - use uniform green for regular classes, orange for trial classes
  if (item.status === 'booked') {
    // Check if it's a trial class
    const isTrialClass = item.type?.toLowerCase().includes('trial');
    
    if (isTrialClass) {
      return 'bg-orange-500 text-white'; // Orange for trial classes
    }
    
    // Default to green for regular sessions/classes
    return 'bg-green-500 text-white';
  }
  
  // Use category-specific color if available and for available slots - EXACTLY matching week view
  if (item.status === 'available' && item.type) {
    switch(item.type.toLowerCase()) {
      case 'session':
        return 'bg-green-500 text-white';
      case 'break':
        return 'bg-blue-600 text-white';
      case 'office':
        return 'bg-purple-600 text-white';
      case 'meeting':
        return 'bg-yellow-500 text-white';
      case 'class setup':
        return 'bg-orange-500 text-white';
      case 'qc':
        return 'bg-pink-600 text-white';
      default:
        return 'bg-green-500 text-white';
    }
  }
  
  // Default to green if no match - EXACTLY matching week view
  return 'bg-green-500 text-white';
};
