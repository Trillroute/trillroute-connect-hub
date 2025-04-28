
import { CourseError } from './CourseError';
import { useNavigate } from 'react-router-dom';

interface CourseDetailErrorProps {
  error: string;
  onRetry: () => void;
}

export const CourseDetailError = ({ error, onRetry }: CourseDetailErrorProps) => {
  const navigate = useNavigate();
  
  return (
    <CourseError 
      error={error}
      onBack={() => navigate(-1)}
      onRetry={onRetry}
    />
  );
};

