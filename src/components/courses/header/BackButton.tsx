
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onNavigateBack: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onNavigateBack }) => {
  return (
    <Button
      variant="ghost"
      onClick={onNavigateBack}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Courses
    </Button>
  );
};
